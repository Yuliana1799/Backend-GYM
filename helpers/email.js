import nodemailer from 'nodemailer';

const generateMailer = () => {
  return nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: 'proyectogymsena@gmail.com', 
      pass: 'aialhcdgvjgmbayj',       
    },
  });
}
 
export const enviarCorreoRecuperacion = async (email, token) => {
  const transporter = generateMailer()

  const mailOptions = {
    from: 'proyectogymsena@gmail.com', 
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Utiliza el siguiente enlace para restablecer tu contraseña: https://proyectogym-i9i3.onrender.com/#/Recuperarpass?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmailWhenExpirationItems = async (email, items) => {
  const transporter = generateMailer()

  const mailOptions = {
    from: 'proyectogymsena@gmail.com', 
    to: email,
    subject: 'Informe diario con items con fecha de vencimiento proxima',
    text: `Recuerda que la fecha de vencimiento de los siguientes productos en tu inventario está proxima a cumplirse.
      Items: 
      ${items.map((item) => {
        return `
          - codigo ${item.codigo} - ${item.descripcion} - ${item.expirationDate} \n
        `
      }).reduce((acc, str) => {
        return acc + str
      }, '') }
    `,
  };

  await transporter.sendMail(mailOptions);
}

export const sendEmailItemsWithoutExpirationDateItems = async (email, items) => {
  const transporter = generateMailer()

  const mailOptions = {
    from: 'proyectogymsena@gmail.com', 
    to: email,
    subject: 'Informe diario con items sin fecha de vencimiento',
    text: `Recuerda agregarle fecha de vencimiento a los siguientes productos.
      Items: 
      ${items.map((item) => {
        return `
          - codigo ${item.codigo} - ${item.descripcion} - ${item.expirationDate} \n
        `
      }).reduce((acc, str) => {
        return acc + str
      }, '') }
    `,
  };

  await transporter.sendMail(mailOptions);
}
