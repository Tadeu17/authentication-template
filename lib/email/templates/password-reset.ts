/**
 * Password Reset Email Template
 */

import type { EmailContent, LocalizedContent } from '../adapter'

const translations: Record<string, LocalizedContent> = {
  'en-US': {
    subject: 'Reset your password',
    greeting: 'Hello!',
    body: 'You requested to reset your password. Click the button below to create a new password:',
    button: 'Reset Password',
    expiry: 'This link will expire in 1 hour.',
    ignore: 'If you did not request a password reset, please ignore this email. Your password will remain unchanged.',
    footer: 'Thanks,<br>The Team',
  },
  'en': {
    subject: 'Reset your password',
    greeting: 'Hello!',
    body: 'You requested to reset your password. Click the button below to create a new password:',
    button: 'Reset Password',
    expiry: 'This link will expire in 1 hour.',
    ignore: 'If you did not request a password reset, please ignore this email. Your password will remain unchanged.',
    footer: 'Thanks,<br>The Team',
  },
  'pt-PT': {
    subject: 'Redefinir a sua palavra-passe',
    greeting: 'Olá!',
    body: 'Solicitou a redefinição da sua palavra-passe. Clique no botão abaixo para criar uma nova palavra-passe:',
    button: 'Redefinir Palavra-passe',
    expiry: 'Este link expira em 1 hora.',
    ignore: 'Se não solicitou a redefinição da palavra-passe, por favor ignore este email. A sua palavra-passe permanecerá inalterada.',
    footer: 'Obrigado,<br>A Equipa',
  },
  'pt': {
    subject: 'Redefinir a sua palavra-passe',
    greeting: 'Olá!',
    body: 'Solicitou a redefinição da sua palavra-passe. Clique no botão abaixo para criar uma nova palavra-passe:',
    button: 'Redefinir Palavra-passe',
    expiry: 'Este link expira em 1 hora.',
    ignore: 'Se não solicitou a redefinição da palavra-passe, por favor ignore este email. A sua palavra-passe permanecerá inalterada.',
    footer: 'Obrigado,<br>A Equipa',
  },
  'es-ES': {
    subject: 'Restablece tu contraseña',
    greeting: '¡Hola!',
    body: 'Has solicitado restablecer tu contraseña. Haz clic en el botón a continuación para crear una nueva contraseña:',
    button: 'Restablecer Contraseña',
    expiry: 'Este enlace expirará en 1 hora.',
    ignore: 'Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo. Tu contraseña permanecerá sin cambios.',
    footer: 'Gracias,<br>El Equipo',
  },
  'es': {
    subject: 'Restablece tu contraseña',
    greeting: '¡Hola!',
    body: 'Has solicitado restablecer tu contraseña. Haz clic en el botón a continuación para crear una nueva contraseña:',
    button: 'Restablecer Contraseña',
    expiry: 'Este enlace expirará en 1 hora.',
    ignore: 'Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo. Tu contraseña permanecerá sin cambios.',
    footer: 'Gracias,<br>El Equipo',
  },
  'fr-FR': {
    subject: 'Réinitialisez votre mot de passe',
    greeting: 'Bonjour !',
    body: 'Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :',
    button: 'Réinitialiser le mot de passe',
    expiry: 'Ce lien expirera dans 1 heure.',
    ignore: "Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet e-mail. Votre mot de passe restera inchangé.",
    footer: "Merci,<br>L'équipe",
  },
  'fr': {
    subject: 'Réinitialisez votre mot de passe',
    greeting: 'Bonjour !',
    body: 'Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :',
    button: 'Réinitialiser le mot de passe',
    expiry: 'Ce lien expirera dans 1 heure.',
    ignore: "Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet e-mail. Votre mot de passe restera inchangé.",
    footer: "Merci,<br>L'équipe",
  },
}

/**
 * Get localized password reset email content
 */
export function getPasswordResetEmailContent(locale: string, resetUrl: string): EmailContent {
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
          <a href="${resetUrl}" style="background: #3B82F6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">${t.button}</a>
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
