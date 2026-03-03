-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : ven. 07 nov. 2025 à 12:41
-- Version du serveur : 8.0.44
-- Version de PHP : 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `apollo_chatbot`
--

-- --------------------------------------------------------

--
-- Structure de la table `FAQ`
--

CREATE TABLE `FAQ` (
  `id` int NOT NULL,
  `question` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `keywords` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `FAQ`
--

INSERT INTO `FAQ` (`id`, `question`, `answer`, `keywords`, `createdAt`, `updatedAt`) VALUES
(1, 'Puis-je annuler un cours', 'Oui, mais attention : si vous vous désinscrivez moins de 18h avant le début du cours, l’annulation est hors délai et le crédit sera dû.', 'annuler,cours,crédit,désinscription', '2025-11-05 18:38:54.000', '2025-11-05 18:38:54.000'),
(2, 'Comment utiliser un code promo WP', 'Allez dans l’application mobile, onglet « studio » puis « packs ». Choisissez la cotisation annuelle + 50 crédits, puis entrez le code promo OB50.', 'code promo,welcome pack,réduction', '2025-11-05 18:38:54.000', '2025-11-05 18:38:54.000'),
(3, 'Puis-je annuler un cours', 'Oui, mais attention : si vous vous désinscrivez moins de 18h avant le début du cours, l’annulation est hors délai et le crédit sera dû.', 'annuler,cours,crédit,désinscription', '2025-11-05 18:46:11.000', '2025-11-05 18:46:11.000'),
(4, 'Comment utiliser un code promo WP', 'Allez dans l’application mobile, onglet « studio » puis « packs ». Choisissez la cotisation annuelle + 50 crédits, puis entrez le code promo OB50.', 'code promo,welcome pack,réduction', '2025-11-05 18:46:11.000', '2025-11-05 18:46:11.000'),
(5, 'annulation de cours hors délai', 'Attention, quand tu te désinscris -18h avant le début du cours, le crédit est dû. Je te remets le crédit pour cette fois que tu puisses réserver à nouveau.', 'annulation,hors délai,désinscription,crédit', '2025-11-05 18:46:11.000', '2025-11-05 18:46:11.000'),
(6, 'Puis-je annuler un cours', 'Oui, mais attention : si vous vous désinscrivez moins de 18h avant le début du cours, l’annulation est hors délai et le crédit sera dû.', 'annuler,cours,crédit,désinscription', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(7, 'Comment utiliser un code promo WP', 'Allez dans l’application mobile, onglet « studio » puis « packs ». Choisissez la cotisation annuelle + 50 crédits, puis entrez le code promo OB50.', 'code promo,welcome pack,réduction', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(8, 'annulation de cours hors délai', 'Attention, quand tu te désinscris -18h avant le début du cours, le crédit est dû. Je te remets le crédit pour cette fois que tu puisses réserver à nouveau.', 'annulation,hors délai,désinscription,crédit', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(9, 'blocage code promo', 'Va sur l’application mobile, onglet « studio » puis « packs », choisis cotisation annuelle + 50 crédits pleins tarif et rentre le code promo OB50. La réduction s’appliquera automatiquement et tu payes.', 'code promo,OB50,blocage,réduction', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(10, 'demande franchise', 'Bonjour, je suis Benjamin Benmoyal, Co-Fondateur du réseau Apollo Sporting Club. Je fais suite à votre demande de franchise, j’aimerais organiser un premier échange téléphonique pour discuter de votre projet. Quand seriez-vous disponible ?', 'franchise,demande,contact,appel', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(11, 'cotisation annuelle expirée', 'Ta cotisation annuelle est expirée, tu dois la renouveler. Connecte-toi à l’application Apollo Sporting Club et vas sur l’onglet « club » puis « cartes de cours » pour acheter la cotisation annuelle seule et pouvoir réserver.', 'cotisation,annuelle,expirée,renouveler,réserver', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(12, 'cours avancé', 'Bonjour, votre cours est avancé. Si vous ne pouvez pas venir, envoyez un mail à contact@apollosportingclub.com pour récupérer votre crédit.', 'cours avancé,crédit,annulé,mail', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(13, 'inscription kids', 'Bonjour, bienvenue à l’Apollo ! Vous trouverez en pièce jointe le document d’inscription pour l’Apollo X pour la prochaine saison avec tous les renseignements nécessaires. Vous pouvez venir faire un cours d’essai gratuit les mercredi ou samedi à 15h. Nous prêterons le matériel pour l’essai.', 'kids,enfant,inscription,cours d’essai', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(14, 'prolongation crédits', 'Pour prolonger la durée de validité de tes crédits restants, il faut reprendre un pack et nous prolongerons tes crédits expirés avec la nouvelle date de validité du pack acheté. Tes crédits ne sont jamais perdus.', 'prolongation,crédits,pack,valide', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(15, 'programme', 'J’ai tenté de vous joindre sans succès, pourriez-vous me rappeler au téléphone pour échanger sur votre demande de programme ?', 'programme,demande,appel', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(16, 'demande info avant inscription', 'Bienvenue à l’Apollo ! Notre offre sans engagement avec paiement à la séance permet une grande flexibilité et notre concept de petit groupe favorise l’accompagnement. Télécharge l’application Apollo Sporting Club pour réserver et tester les cours.', 'information,inscription,débutant,cours', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(17, 'ouverture droits étudiants', 'J’ai ouvert tes droits étudiants, va sur l’application Apollo Sporting Club, onglet « studio » puis « packs », achète le pack cotisation annuelle tarif réduit + le pack de crédits de ton choix.', 'étudiant,droits,cotisation,pack', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(18, 'cartes cadeaux', 'Bonjour, nous avons un système de carte cadeau. Télécharge l’application Apollo Sporting Club, onglet « studio » puis « cartes cadeaux », et achète celle qui te convient le mieux.', 'carte cadeau,cadeau,achat', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(19, 'choix des cours', 'Technique : pour apprendre les bases, la gestuelle, choisir boxe anglaise ou française. Physique : pour se défouler, travail le cardio/renfo, choisir cardio boxing, boxing bag, circuit training.', 'cours,choix,technique,physique,boxe,cardio', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(20, 'matériel', 'Pour démarrer, viens avec une tenue de sport, une paire de basket propre, une serviette. Pour le matériel, il te faut gants et bandes. Deux solutions : 1) tu peux les louer à la salle pour 1€ par article. 2) nous vendons du matériel de très bonne qualité à tarif négocié à la salle et pouvons te conseiller.', 'matériel,gants,bandes,location,achat', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(21, 'cotisation annuelle', 'Tu dois simplement renouveler ta cotisation annuelle qui est expirée pour pouvoir réserver.', 'cotisation,annuelle,expirée,réserver', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(22, 'cours annulé seul', 'Bonjour, tu es seul au cours, celui-ci est donc annulé et ton crédit remis. Tu peux venir à un autre cours si tu le souhaites.', 'cours annulé,seul,crédit,remis', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(23, 'droits tarif réduit', 'J’ai ouvert tes droits tarif réduit. Après l’utilisation de tes 3 crédits d’essai, tu achètes la cotisation annuelle tarif réduit et une fois l’achat validé tu prends le pack de crédits tarif réduit de ton choix.', 'tarif réduit,crédits d’essai,cotisation,pack', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000'),
(24, 'objets trouvés', 'Tout ce qui est trouvé dans les salles est conservé, demande-le à l’accueil lors de ta prochaine venue.', 'objets trouvés,perdu,salle,accueil', '2025-11-05 18:48:59.000', '2025-11-05 18:48:59.000');

-- --------------------------------------------------------

--
-- Structure de la table `Message`
--

CREATE TABLE `Message` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `text` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `credits` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('35241d88-6fe7-4b83-838d-5cfbbee96570', '26f009b2d483c2319df9dd6a797d94cfed1959194c28037cc2a25ca303436d4f', '2025-11-05 18:47:47.533', '20251105184747_change_answer_to_text', NULL, NULL, '2025-11-05 18:47:47.466', 1),
('3810d7d8-2763-41cd-abf4-a6b944b77bc5', '0c6f45f833fb0c5e5cd01ed26c11b0de88b1813b30a48186ff80f2946cb9f63f', '2025-11-05 18:13:34.402', '20251105181334_init', NULL, NULL, '2025-11-05 18:13:34.233', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `FAQ`
--
ALTER TABLE `FAQ`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Message`
--
ALTER TABLE `Message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Message_userId_fkey` (`userId`);

--
-- Index pour la table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Index pour la table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `FAQ`
--
ALTER TABLE `FAQ`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `Message`
--
ALTER TABLE `Message`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `User`
--
ALTER TABLE `User`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Message`
--
ALTER TABLE `Message`
  ADD CONSTRAINT `Message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
