export const URL_PATTERN = '(https?://)([\\\\da-z.-]+)\\\\.([a-z.]{2,6})[/\\\\w .-]*/?';

export const BAD_REQUEST_ERRORS = {
  LoginError: 'Erreur d\'authentification: combinaison email / mot de passe invalide.',
  LogoutError: 'Erreur de deconnexion: la déconnexion a échouée du côté serveur.',
  RemovedValueProhibited: 'Suppression impossible, la requête n\'autorise pas la suppression d\'associations.',
  BadRequest: 'Requête mal formée: la requête ne respecte pas le format imposé par le serveur.',
  UnknownUser: 'Utilisateur inconnu: l\'utilisateur est introuvable dans la base de données.',
  UnknownMember: 'Adhérent inconnu: l\'adhérent est introuvable dans la base de données.',
  UnknownKommission: 'Kommission inconnue: la kommission est introuvable dans la base de données.',
  UnknownBarman: 'Barman inconnu: Le barman est introuvable dans la base de données.',
  UnknownService: 'Service inconnu: le service est introuvable dans la base de données.',
  UnverifiedEmail: 'Email non verifié: l\'addresse email n\'a pas été vérifié, merci de vérifier vos e-mails.',
  UndefinedPassword: 'Le mot de passe n\'a pas été défini, merci de vérifier vos e-mails.',
  MailerError: 'L\'envoi du mail du côté serveur a échoué. Merci de vérifier que l\'adresse email est valide.',
  CodeError: 'Code invalide: Le code n\'est pas valide.',
  BadEmail: 'L\'email n\'est pas disponible',
  WeakPassword: 'Le mot de passe doit contenir au moins 1 minuscule, 1 majuscule, 1 chiffre et plus de 8 charactères.',
  UnknownPasswordToken: 'Token inconnu: le token utilisé n\'existe pas ou n\'est plus valide',
  TooOldEvent: 'Modification impossible car la date de fin du service est passée',
  CaptchaVerificationFailed: 'Erreur dans la validation du captcha côté serveur, merci d\'essayer à nouveau',
  VerificationError: 'Erreur de vérification',
  NoPasswordToken: 'Erreur, votre mot de passe est surement déjà défini',
  BadLeaveAtDate: 'Erreur, la date de départ ne peut pas être avant la date d\'entrée',
  MemberAlreadyRegistered: 'Erreur, l\'adhérent est déjà inscrit pour l\'année',
  ReservedPermission: 'La permission admin:upgrade est réservée. Veuillez contacter l\'administrateur.',
};

export const ROLES = [
  {
    name: 'TEMPLATE_MANAGER',
    permissions: [
      'template:read',
      'template:write',
    ],
  },
  {
    name: 'SERVICE_MANAGER',
    permissions: [
      'service:read',
      'service:write',
    ],
  },
  {
    name: 'SERVICE_PLAN',
    permissions: [
      'service:read',
      'barman:read',
    ],
  },
];

function getCurrentSchoolYear() {
  const date = new Date();

  if (date.getMonth() < 7) {
    return date.getFullYear() - 1;
  }
  return date.getFullYear();
}

export const CURRENT_SCHOOL_YEAR = getCurrentSchoolYear();

export const AVAILABLE_SCHOOLS = ['INSA', 'Polytech', 'CPE', 'Lyon 1', 'Autre'];

// The K-Fêt week change every thusday ( = 4 )
export const DEFAULT_WEEK_SWITCH = 5;
