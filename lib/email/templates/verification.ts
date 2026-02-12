/**
 * Email Verification Template
 */

import type { EmailContent, LocalizedContent } from '../adapter'

const translations: Record<string, LocalizedContent> = {
  'en-US': {
    subject: 'Verify your email address',
    greeting: 'Hello!',
    body: 'Thank you for registering. Please verify your email address by clicking the button below:',
    button: 'Verify Email',
    expiry: 'This link will expire in 24 hours.',
    ignore: 'If you did not create an account, please ignore this email.',
    footer: 'Thanks,<br>The Team',
  },
  'en': {
    subject: 'Verify your email address',
    greeting: 'Hello!',
    body: 'Thank you for registering. Please verify your email address by clicking the button below:',
    button: 'Verify Email',
    expiry: 'This link will expire in 24 hours.',
    ignore: 'If you did not create an account, please ignore this email.',
    footer: 'Thanks,<br>The Team',
  },
  'pt-PT': {
    subject: 'Verifique o seu endereço de email',
    greeting: 'Olá!',
    body: 'Obrigado por se registar. Por favor, verifique o seu endereço de email clicando no botão abaixo:',
    button: 'Verificar Email',
    expiry: 'Este link expira em 24 horas.',
    ignore: 'Se não criou uma conta, por favor ignore este email.',
    footer: 'Obrigado,<br>A Equipa',
  },
  'pt': {
    subject: 'Verifique o seu endereço de email',
    greeting: 'Olá!',
    body: 'Obrigado por se registar. Por favor, verifique o seu endereço de email clicando no botão abaixo:',
    button: 'Verificar Email',
    expiry: 'Este link expira em 24 horas.',
    ignore: 'Se não criou uma conta, por favor ignore este email.',
    footer: 'Obrigado,<br>A Equipa',
  },
  'es-ES': {
    subject: 'Verifica tu dirección de correo electrónico',
    greeting: '¡Hola!',
    body: 'Gracias por registrarte. Por favor, verifica tu dirección de correo electrónico haciendo clic en el botón a continuación:',
    button: 'Verificar Email',
    expiry: 'Este enlace expirará en 24 horas.',
    ignore: 'Si no creaste una cuenta, por favor ignora este correo.',
    footer: 'Gracias,<br>El Equipo',
  },
  'es': {
    subject: 'Verifica tu dirección de correo electrónico',
    greeting: '¡Hola!',
    body: 'Gracias por registrarte. Por favor, verifica tu dirección de correo electrónico haciendo clic en el botón a continuación:',
    button: 'Verificar Email',
    expiry: 'Este enlace expirará en 24 horas.',
    ignore: 'Si no creaste una cuenta, por favor ignora este correo.',
    footer: 'Gracias,<br>El Equipo',
  },
  'fr-FR': {
    subject: 'Vérifiez votre adresse e-mail',
    greeting: 'Bonjour !',
    body: "Merci de vous être inscrit. Veuillez vérifier votre adresse e-mail en cliquant sur le bouton ci-dessous :",
    button: "Vérifier l'e-mail",
    expiry: 'Ce lien expirera dans 24 heures.',
    ignore: "Si vous n'avez pas créé de compte, veuillez ignorer cet e-mail.",
    footer: "Merci,<br>L'équipe",
  },
  'fr': {
    subject: 'Vérifiez votre adresse e-mail',
    greeting: 'Bonjour !',
    body: "Merci de vous être inscrit. Veuillez vérifier votre adresse e-mail en cliquant sur le bouton ci-dessous :",
    button: "Vérifier l'e-mail",
    expiry: 'Ce lien expirera dans 24 heures.',
    ignore: "Si vous n'avez pas créé de compte, veuillez ignorer cet e-mail.",
    footer: "Merci,<br>L'équipe",
  },
}

/**
 * Get localized verification email content
 */
export function getVerificationEmailContent(locale: string, verifyUrl: string): EmailContent {
  const t = translations[locale] || translations['en']

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${t.subject}</h1>
      </div>
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; margin-bottom: 20px;">${t.greeting}</p>
        <p style="font-size: 16px; margin-bottom: 30px;">${t.body}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #3B82F6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">${t.button}</a>
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 30px;">${t.expiry}</p>
        <p style="font-size: 14px; color: #666;">${t.ignore}</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        <p style="font-size: 14px; color: #666;">${t.footer}</p>
      </div>
    </body>
    </html>
  `

  return { subject: t.subject, html }
}
