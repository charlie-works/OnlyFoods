import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@onlyfoods.com'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { name, email, phone, message } = await req.json()

    // Store in Supabase database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Insert into database
    const { error: dbError } = await supabaseClient
      .from('membership_applications')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          message: message || null,
          created_at: new Date().toISOString()
        }
      ])

    if (dbError) {
      console.error('Database error:', dbError)
    }

    // Send email via Resend
    if (RESEND_API_KEY) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'OnlyFoods <noreply@onlyfoods.com>',
          to: [ADMIN_EMAIL],
          subject: 'New Membership Application - OnlyFoods',
          html: `
            <h2>New Membership Application</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${message || 'No message provided'}</p>
          `
        }),
      })

      if (!emailResponse.ok) {
        console.error('Email error:', await emailResponse.text())
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Application submitted successfully!' }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to submit application. Please try again.' }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 500,
      }
    )
  }
})
