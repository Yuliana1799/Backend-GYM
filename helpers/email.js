


import nodemailer from 'nodemailer';

export const enviarCorreoRecuperacion = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: 'proyectogymsena@gmail.com', 
      pass: 'aialhcdgvjgmbayj',       
    },
  });

  const mailOptions = {
    from: 'proyectogymsena@gmail.com', 
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Utiliza el siguiente enlace para restablecer tu contraseña: https://proyectogym-i9i3.onrender.com/#/Recuperarpass?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};
