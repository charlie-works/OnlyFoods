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
    const { name, email, phone, items, specialInstructions } = await req.json()

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
      .from('orders')
      .insert([
        {
          name,
          email,
          phone,
          items,
          special_instructions: specialInstructions || null,
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
          to: [email],
          cc: [ADMIN_EMAIL],
          subject: 'Order Confirmation - OnlyFoods',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2c5530;">Order Confirmation</h2>
              <p>Thank you for your order, ${name}!</p>
              
              <h3>Order Details:</h3>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Items:</strong></p>
                <p style="white-space: pre-wrap;">${items}</p>
                ${specialInstructions ? `<p><strong>Special Instructions:</strong> ${specialInstructions}</p>` : ''}
              </div>
              
              <h3>Next Steps:</h3>
              <ol>
                <li>Complete your payment via Venmo (link provided on order page)</li>
                <li>Pick up your order at the designated location and time</li>
              </ol>
              
              <p>We'll see you soon!</p>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">OnlyFoods Team</p>
            </div>
          `
        }),
      })

      if (!emailResponse.ok) {
        console.error('Email error:', await emailResponse.text())
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Order submitted successfully! Check your email for confirmation.' }),
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
      JSON.stringify({ success: false, message: 'Failed to submit order. Please try again.' }),
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
