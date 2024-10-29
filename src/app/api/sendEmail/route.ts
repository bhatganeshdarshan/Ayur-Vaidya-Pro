import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  const { date, time, duration, message } = await req.json()

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587,                
    auth: {
      user: 'bhatganeshdarshan10@gmail.com', 
      pass: 'yply uwtc eber wodx'
    }
  })

  try {
    await transporter.sendMail({
        from: 'bhatganeshdarshan10@gmail.com',
        to: '1by22ai027@bmsit.in', 
        subject: 'New Appointment Request from Ayur Vaidya Pro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; color: #333;">
            <h2 style="color: #4CAF50; text-align: center;">New Appointment Request</h2>
            <p style="font-size: 16px;">Hello Doctor,</p>
            <p style="font-size: 16px;">You have received a new appointment request with the following details:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Date</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Time</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Duration</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${duration} minutes</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Message</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
              </tr>
            </table>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://localhost:3000/api/appointments/accept?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}" 
                 style="padding: 12px 24px; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                Accept Appointment
              </a>
            </div>
            
            <p style="font-size: 14px; color: #555; margin-top: 20px;">Thank you,<br><strong>Ayur Vaidya Pro Team</strong></p>
            <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">This message was sent from Ayur Vaidya Pro.</p>
          </div>
        `
      })
      
      

    return new Response(JSON.stringify({ message: 'Appointment request sent successfully!' }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to send email', error }), { status: 500 })
  }
}
