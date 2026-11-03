-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: eventgo_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,2,'USER_LOGIN','User',2,'User logged in successfully','::ffff:127.0.0.1','2026-11-02 15:45:46'),(2,2,'USER_LOGIN','User',2,'User logged in successfully','::ffff:127.0.0.1','2026-11-02 16:10:25'),(3,2,'PAYMENT_SUCCESS','Order',4,'Purchased 1 tickets','::ffff:127.0.0.1','2026-11-02 16:16:41'),(4,2,'PAYMENT_FAILED','Order',4,'Amount mismatch','::ffff:127.0.0.1','2026-11-02 16:17:35'),(5,2,'PAYMENT_SUCCESS','Order',4,'Purchased 1 tickets','::ffff:127.0.0.1','2026-11-02 16:17:49'),(6,2,'PAYMENT_SUCCESS','Order',4,'Purchased 1 tickets','::ffff:127.0.0.1','2026-11-02 16:17:58'),(7,2,'PAYMENT_FAILED','Order',4,'Amount mismatch','::ffff:127.0.0.1','2026-11-02 16:18:08'),(8,2,'PAYMENT_SUCCESS','Order',4,'Purchased 1 tickets','::ffff:127.0.0.1','2026-11-02 16:18:24'),(9,2,'PAYMENT_SUCCESS','Order',4,'Purchased 1 tickets','::ffff:127.0.0.1','2026-11-02 16:18:33'),(10,2,'PAYMENT_FAILED','Order',4,'Amount mismatch','::ffff:127.0.0.1','2026-11-02 16:39:00'),(11,2,'PAYMENT_FAILED','Order',4,'Amount mismatch','::ffff:127.0.0.1','2026-11-02 16:39:08'),(12,2,'PASSWORD_RESET','User',2,'Password reset successfully','::ffff:127.0.0.1','2026-11-02 17:26:55'),(13,2,'USER_LOGIN','User',2,'User logged in successfully','::ffff:127.0.0.1','2026-11-02 17:27:41'),(14,2,'USER_LOGIN','User',2,'User logged in successfully','::ffff:127.0.0.1','2026-11-02 17:42:26'),(15,2,'PASSWORD_RESET','User',2,'Password reset successfully','::ffff:127.0.0.1','2026-11-02 17:42:57'),(16,NULL,'USER_REGISTER','User',3,'New user registered','::ffff:127.0.0.1','2026-11-02 18:38:13'),(17,1,'USER_LOGIN','User',1,'User logged in successfully','::ffff:127.0.0.1','2026-11-02 18:59:09'),(18,1,'USER_LOGIN_2FA','User',1,'Admin passed 2FA verification','::ffff:127.0.0.1','2026-11-02 19:01:53'),(19,2,'PAYMENT_SUCCESS','Order',6,'Purchased 1 tickets','::ffff:127.0.0.1','2026-11-02 20:26:57'),(20,4,'USER_REGISTER','User',4,'New user registered','::ffff:127.0.0.1','2026-11-03 12:10:49'),(21,4,'USER_LOGIN','User',4,'User logged in successfully','::ffff:127.0.0.1','2026-11-03 12:13:08'),(22,4,'PAYMENT_CANCELLED','Order',7,'User cancelled/failed','::1','2026-11-03 12:14:56'),(23,4,'PAYMENT_SUCCESS','Order',7,'Purchased 1 tickets','::ffff:127.0.0.1','2026-11-03 12:16:19');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_tokens`
--

DROP TABLE IF EXISTS `auth_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_tokens` (
  `token_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `purpose` enum('two_fa_otp','password_reset') COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `auth_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES (7,2,'password_reset','$2b$10$JlfHS.pipcZ9vAhRRJSuz.GCV2hjnvZsdhwXjHJ30n7R5IVlNfPcO','2026-11-02 17:57:33','2026-11-02 17:42:57','2026-11-02 17:42:33'),(11,1,'two_fa_otp','$2b$10$9zYznDxkMYLfXBwywBPOPudhX7YgzKI7ioEVfu1EpIGna/vPTWCOO','2026-11-02 19:04:09','2026-11-02 19:01:53','2026-11-02 18:59:09');
/*!40000 ALTER TABLE `auth_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Music','Concerts and gigs'),(2,'Technology','Tech conferences'),(3,'Business','Expos, trade fairs, and business summits'),(4,'Culture & Arts','Festivals, heritage, and creative showcases'),(5,'Sports','Athletic events, derbies, and outdoor challenges');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `created_by` int NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `venue` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` datetime NOT NULL,
  `banner_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published','cancelled','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `category_id` (`category_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT,
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,2,1,'Nairobi Tech Summit','The biggest tech event of the year.','KICC, Nairobi','2026-12-15 06:00:00',NULL,'published','2026-11-02 14:39:24'),(2,1,1,'Blankets & Wine','Kenya\'s premier live music and lifestyle festival featuring top African artists.','Laureate Gardens, Moi International Sports Centre, Nairobi','2026-06-07 12:00:00',NULL,'published','2026-11-02 18:01:41'),(3,1,1,'Kilele Summit','A transformative music and tech summit bringing together creatives and innovators.','Nairobi (Various Venues)','2026-02-23 09:00:00',NULL,'published','2026-11-02 18:01:41'),(4,1,1,'SolFest','A vibrant celebration of African music and culture under the Nairobi sky.','Uhuru Gardens, Nairobi','2026-12-17 14:00:00',NULL,'published','2026-11-02 18:01:41'),(5,1,1,'Detty Dezemba Festival','The ultimate December music festival headlined by international and local stars.','Nairobi','2026-12-20 18:00:00',NULL,'published','2026-11-02 18:01:41'),(6,2,1,'AI Everything Kenya x GITEX Kenya','East Africa\'s largest AI and innovation ecosystem event.','Sarit Expo Centre & KICC, Nairobi','2026-05-19 09:00:00',NULL,'published','2026-11-02 18:01:41'),(7,2,1,'WSO2Con Africa','A premier conference for enterprise architects and developers.','Nairobi','2026-09-22 08:30:00',NULL,'published','2026-11-02 18:01:41'),(8,2,1,'Global Data Science & AI Summit','Powering Africa\'s intelligent transformation through agentic AI and data ecosystems.','@iLabAfrica, Strathmore University, Nairobi','2026-11-19 09:00:00',NULL,'published','2026-11-02 18:01:41'),(9,2,1,'Africa Tech Policy Summit','Africa\'s premier multistakeholder forum shaping inclusive digital transformation.','Nairobi','2026-05-19 09:00:00',NULL,'published','2026-11-02 18:01:41'),(10,3,1,'40th Kenya Homes Expo','The largest showcase of home and property solutions in East Africa.','KICC, Nairobi','2026-11-19 10:00:00',NULL,'published','2026-11-02 18:01:41'),(11,3,1,'27th AutoExpo Kenya','The region\'s leading automotive and spare parts trade exhibition.','KICC, Nairobi','2026-06-03 09:00:00',NULL,'published','2026-11-02 18:01:41'),(12,3,1,'Luxury Living & Design Expo','A showcase of high-end interior design, architecture, and lifestyle brands.','Edge Convention Center, Nairobi','2026-07-04 10:00:00',NULL,'published','2026-11-02 18:01:41'),(13,4,1,'Lamu Painters Festival','A celebration of Swahili culture, art, and heritage on the beautiful island of Lamu.','Lamu Island','2026-11-14 10:00:00',NULL,'published','2026-11-02 18:01:41'),(14,5,1,'Diani Ngalawa Regatta','A thrilling traditional dhow boat race and beach festival on the South Coast.','Diani Beach, Kwale','2026-08-15 08:00:00',NULL,'published','2026-11-02 18:01:41'),(15,5,1,'Rhino Charge','A grueling off-road motorsport event raising funds for conservation.','Laikipia Plateau','2026-05-30 07:00:00',NULL,'published','2026-11-02 18:01:41'),(16,5,1,'International Camel Derby','An iconic cultural sports event featuring camel races and community festivities.','Maralal, Samburu','2026-08-29 08:00:00',NULL,'published','2026-11-02 18:01:41'),(17,2,1,'Africa Internet Summit 2026','Africa\'s Internet community for technical exchange and policy dialogue.','Nairobi, Kenya','2026-06-22 06:00:00',NULL,'published','2026-11-03 12:54:13'),(18,2,1,'Africa Blockchain Festival 2026','Bringing together blockchain and AI leaders from Africa and beyond.','Nairobi, Kenya','2026-10-15 06:00:00',NULL,'published','2026-11-03 12:54:13'),(19,2,1,'AfricArena Nairobi Summit 2026','Two-day summit connecting startups, investors, and corporates.','Radisson Blu Hotel, Nairobi Upper Hill','2026-09-15 06:00:00',NULL,'published','2026-11-03 12:54:13'),(20,2,1,'MindTech Conference Nairobi 2026','Exploring the intersection of technology and mental health.','Embakasi, Nairobi','2026-08-10 06:00:00',NULL,'published','2026-11-03 12:54:13'),(21,2,1,'Spirit of Africa Festival 2026','Live music, cultural performances, and immersive VR/AR experiences.','Nairobi, Kenya','2026-10-06 06:00:00',NULL,'published','2026-11-03 12:54:13'),(22,1,1,'Festival of Sound and Art','A month of live performances every Sunday.','Sarit Rooftop Garden, Nairobi','2026-08-02 15:00:00',NULL,'published','2026-11-03 12:54:13'),(23,1,1,'Haus of Kühl Nairobi 2026','South African and Kenyan DJs and dancers.','Sk8City at Diamond Plaza 2, Nairobi','2026-09-26 15:00:00',NULL,'published','2026-11-03 12:54:13'),(24,1,1,'Don Carlos Reggae Showcase','Jamaican reggae legend Don Carlos live in Nairobi.','Carnivore Grounds, Nairobi','2026-10-09 17:00:00',NULL,'published','2026-11-03 12:54:13'),(25,1,1,'ONE NIGHT ONLY MAY 2026','A Festival of AfroPop, Soul and Jazz.','Sarit Expo Centre, Nairobi','2026-05-31 15:00:00',NULL,'published','2026-11-03 12:54:13'),(26,1,1,'MachokaAt50 Grand Concert','Koffi Olomide headlines this grand concert.','Nairobi, Kenya','2026-10-10 17:00:00',NULL,'published','2026-11-03 12:54:13'),(27,1,1,'Dala Festival 2026','Ferré Gola performs at this Jamhuri Day festival.','Nairobi, Kenya','2026-12-12 15:00:00',NULL,'published','2026-11-03 12:54:13'),(28,4,1,'Imbalu Festival 2026','A five-day cultural festival featuring traditional music and dance.','Sang\'alo Cultural Centre, Bungoma','2026-08-11 07:00:00',NULL,'published','2026-11-03 12:54:13'),(29,4,1,'Piny Luo Cultural Festival','The 6th edition celebrating Luo cultural heritage.','Kisumu, Kenya','2026-12-14 07:00:00',NULL,'published','2026-11-03 12:54:13'),(30,4,1,'Iteso Cultural Celebrations','Over 50,000 visitors expected for cultural displays and entertainment.','Kenya/Uganda border region','2026-10-29 07:00:00',NULL,'published','2026-11-03 12:54:13'),(31,4,1,'iToka Chapter 2','A multidisciplinary cultural festival of art, music, and fashion.','Eva\'s Garden in Redhill, Limuru','2026-08-29 07:00:00',NULL,'published','2026-11-03 12:54:13'),(32,4,1,'Nairobi Litfest 2026','Blending literature, music, and cultural conversations.','McMillan Memorial Library, Nairobi','2026-05-08 07:00:00',NULL,'published','2026-11-03 12:54:13'),(33,4,1,'Lake Turkana Festival','A unique cultural festival near Sibiloi National Park.','Loiyangalani, Marsabit County','2026-05-25 07:00:00',NULL,'published','2026-11-03 12:54:13'),(34,5,1,'Eldoret City Marathon 2026','The seventh edition of this iconic marathon.','Eldoret, Uasin Gishu County','2026-04-26 04:00:00',NULL,'published','2026-11-03 12:54:13'),(35,5,1,'Standard Chartered Nairobi Marathon','Kenya\'s flagship road race with 42km, 21km, and 10km categories.','Uhuru Gardens, Nairobi','2026-10-25 03:00:00',NULL,'published','2026-11-03 12:54:13'),(36,5,1,'Nairobi City Marathon 2026','Over 17,000 runners expected in this 5th edition.','City Hall to Uhuru Park, Nairobi','2026-06-07 03:00:00',NULL,'published','2026-11-03 12:54:13'),(37,3,1,'EAC MSME Trade Fair 2026','Showcasing MSMEs and investment opportunities across East Africa.','Kigali, Rwanda','2026-10-30 06:00:00',NULL,'published','2026-11-03 12:54:13'),(38,3,1,'INDUSMACH KENYA 2026','The largest international trade exhibition for industrial manufacturing.','KICC, Nairobi','2026-06-03 06:00:00',NULL,'published','2026-11-03 12:54:13'),(39,3,1,'China Trade Week (CTW) Kenya 2026','East Africa\'s leading international trade exhibition.','KICC, Nairobi','2026-07-22 06:00:00',NULL,'published','2026-11-03 12:54:13'),(40,3,1,'Africa Technology Show (AFTS) 2026','Co-located with China Trade Week, focusing on technology.','KICC, Nairobi','2026-07-22 06:00:00',NULL,'published','2026-11-03 12:54:13'),(41,3,1,'Africa Build Show Kenya 2026','The 4th edition of this construction and energy exhibition.','KICC, Nairobi','2026-07-22 06:00:00',NULL,'published','2026-11-03 12:54:13'),(42,3,1,'MEGAWATT Africa Kenya 2026','The 3rd edition focusing on power and energy.','KICC, Nairobi','2026-07-22 06:00:00',NULL,'published','2026-11-03 12:54:13');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ticket_type_id` int NOT NULL,
  `quantity` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','failed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `ticket_type_id` (`ticket_type_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types` (`ticket_type_id`) ON DELETE RESTRICT,
  CONSTRAINT `orders_chk_1` CHECK ((`quantity` between 1 and 10)),
  CONSTRAINT `orders_chk_2` CHECK ((`total_amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,1,1,2000.00,'failed','2026-11-02 14:41:13'),(2,2,1,1,1.00,'pending','2026-11-02 14:44:22'),(3,2,1,1,1.00,'paid','2026-11-02 14:45:47'),(4,2,1,1,1500.00,'failed','2026-11-02 16:11:25'),(5,2,1,1,1500.00,'pending','2026-11-02 19:22:36'),(6,2,1,1,1500.00,'paid','2026-11-02 20:22:04'),(7,4,1,1,1500.00,'paid','2026-11-03 12:14:27'),(8,5,3,1,1500.00,'pending','2026-11-03 12:28:07'),(9,8,28,3,15000.00,'paid','2026-11-03 12:28:07'),(10,5,20,3,15000.00,'paid','2026-11-03 12:28:07'),(11,9,23,3,4500.00,'paid','2026-11-03 12:28:07'),(12,8,17,1,1500.00,'paid','2026-11-03 12:28:07'),(13,6,8,1,5000.00,'paid','2026-11-03 12:28:07'),(14,6,11,2,3000.00,'paid','2026-11-03 12:28:07'),(15,9,6,1,5000.00,'pending','2026-11-03 12:28:07'),(16,5,26,3,15000.00,'paid','2026-11-03 12:28:08'),(17,6,19,3,4500.00,'paid','2026-11-03 12:28:08'),(18,6,4,3,15000.00,'paid','2026-11-03 12:28:08'),(19,7,8,3,15000.00,'paid','2026-11-03 12:28:08'),(20,8,21,3,4500.00,'paid','2026-11-03 12:28:08'),(21,9,2,2,3000.00,'paid','2026-11-03 12:28:08'),(22,5,21,3,4500.00,'pending','2026-11-03 12:28:08'),(23,7,17,3,4500.00,'paid','2026-11-03 12:28:08'),(24,5,12,1,5000.00,'pending','2026-11-03 12:28:08'),(25,6,20,2,10000.00,'paid','2026-11-03 12:28:08'),(26,5,23,1,1500.00,'paid','2026-11-03 12:28:08'),(27,7,29,1,1500.00,'paid','2026-11-03 12:28:08'),(28,8,7,3,4500.00,'pending','2026-11-03 12:28:08'),(29,9,29,1,1500.00,'paid','2026-11-03 12:28:08'),(30,8,3,2,3000.00,'paid','2026-11-03 12:28:08'),(31,8,17,2,3000.00,'paid','2026-11-03 12:28:08'),(32,8,6,3,15000.00,'paid','2026-11-03 12:28:08'),(33,6,21,3,4500.00,'paid','2026-11-03 12:28:08'),(34,6,23,3,4500.00,'paid','2026-11-03 12:28:08'),(35,8,32,1,5000.00,'paid','2026-11-03 12:28:08'),(36,7,15,2,3000.00,'pending','2026-11-03 12:28:08'),(37,8,3,1,1500.00,'pending','2026-11-03 12:28:08'),(38,6,25,1,1500.00,'paid','2026-11-03 12:28:08'),(39,9,19,2,3000.00,'paid','2026-11-03 12:28:08'),(40,9,27,1,1500.00,'paid','2026-11-03 12:28:08'),(41,7,6,2,10000.00,'paid','2026-11-03 12:28:08'),(42,9,31,2,3000.00,'paid','2026-11-03 12:28:08'),(43,5,29,3,4500.00,'pending','2026-11-03 12:28:08'),(44,5,7,3,4500.00,'paid','2026-11-03 12:28:08'),(45,5,1,1,1500.00,'paid','2026-11-03 12:28:09'),(46,5,28,3,15000.00,'pending','2026-11-03 12:28:09'),(47,8,3,3,4500.00,'paid','2026-11-03 12:28:09'),(48,9,25,3,4500.00,'pending','2026-11-03 12:28:09'),(49,5,8,1,5000.00,'pending','2026-11-03 12:28:09'),(50,7,11,1,1500.00,'paid','2026-11-03 12:28:09'),(51,9,18,3,15000.00,'paid','2026-11-03 12:28:09'),(52,7,27,3,4500.00,'paid','2026-11-03 12:28:09'),(53,6,31,1,1500.00,'paid','2026-11-03 12:28:09'),(54,7,29,2,3000.00,'pending','2026-11-03 12:28:09'),(55,7,3,1,1500.00,'paid','2026-11-03 12:28:09'),(56,9,20,2,10000.00,'pending','2026-11-03 12:28:09'),(57,9,27,2,3000.00,'paid','2026-11-03 12:28:09');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `phone_number` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `checkout_request_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mpesa_receipt` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','success','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `initiated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paid_at` datetime DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `checkout_request_id` (`checkout_request_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE RESTRICT,
  CONSTRAINT `payments_chk_1` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'254706777549',2000.00,'ws_CO_021120261741150706777549',NULL,'failed','2026-11-02 14:41:15',NULL),(2,2,'254706777549',1.00,'ws_CO_021120261744232706777549',NULL,'pending','2026-11-02 14:44:24',NULL),(3,3,'254706777549',1.00,'ws_CO_021120261745478706777549','TEST123XYZ','success','2026-11-02 14:45:48','2026-11-02 14:50:13'),(4,4,'254708374149',1500.00,'ws_CO_021120261911267708374149','SECURE123','failed','2026-11-02 16:11:32','2026-11-02 16:18:33'),(5,5,'254706777549',1500.00,'ws_CO_021120262222361706777549',NULL,'pending','2026-11-02 19:22:37',NULL),(6,6,'254708374149',1500.00,'ws_CO_021120262322046708374149','SECURE999','success','2026-11-02 20:22:06','2026-11-02 20:26:57'),(7,7,'254708374149',1500.00,'ws_CO_031120261514310708374149','QRCODE123','success','2026-11-03 12:14:30','2026-11-03 12:16:19'),(8,8,'254711000001',1500.00,'ws_CO_4801c4b61ee26a9b',NULL,'pending','2026-11-03 12:28:07',NULL),(9,9,'254711000004',15000.00,'ws_CO_e4b6906cd77e30d2','MOCKC49596','success','2026-11-03 12:28:07','2026-11-03 12:28:07'),(10,10,'254711000001',15000.00,'ws_CO_91367c5525f1c919','MOCKB6C355','success','2026-11-03 12:28:07','2026-11-03 12:28:07'),(11,11,'254711000005',4500.00,'ws_CO_b1874c7f1d013037','MOCK87B9EC','success','2026-11-03 12:28:07','2026-11-03 12:28:07'),(12,12,'254711000004',1500.00,'ws_CO_f5157c5be47a5fc8','MOCKFAB7C5','success','2026-11-03 12:28:07','2026-11-03 12:28:07'),(13,13,'254711000002',5000.00,'ws_CO_ba2bec86f5365cb3','MOCKE54309','success','2026-11-03 12:28:07','2026-11-03 12:28:07'),(14,14,'254711000002',3000.00,'ws_CO_c7cb886738cd121e','MOCK9BABE2','success','2026-11-03 12:28:07','2026-11-03 12:28:07'),(15,15,'254711000005',5000.00,'ws_CO_b0fd1dea251363e0',NULL,'pending','2026-11-03 12:28:07',NULL),(16,16,'254711000001',15000.00,'ws_CO_38327aeae67d549a','MOCK86CF21','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(17,17,'254711000002',4500.00,'ws_CO_e18b541f15e71eda','MOCKC9F219','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(18,18,'254711000002',15000.00,'ws_CO_2cc0b06ef4e251a1','MOCK9FA9AC','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(19,19,'254711000003',15000.00,'ws_CO_938ce72e0bfebb69','MOCK5F9AC1','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(20,20,'254711000004',4500.00,'ws_CO_f508ce46895a0739','MOCKCA8BFB','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(21,21,'254711000005',3000.00,'ws_CO_196d24702b9e256a','MOCK596001','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(22,22,'254711000001',4500.00,'ws_CO_e1c55483c49e1970',NULL,'pending','2026-11-03 12:28:08',NULL),(23,23,'254711000003',4500.00,'ws_CO_1cb2f6f88d4fbcf3','MOCK1B57CD','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(24,24,'254711000001',5000.00,'ws_CO_29fbe5b8f8425283',NULL,'pending','2026-11-03 12:28:08',NULL),(25,25,'254711000002',10000.00,'ws_CO_27dcb6f153734675','MOCKFFCD73','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(26,26,'254711000001',1500.00,'ws_CO_5d0ec4bf453c9473','MOCK7BD697','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(27,27,'254711000003',1500.00,'ws_CO_0765e5808a1a4444','MOCK4BD26E','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(28,28,'254711000004',4500.00,'ws_CO_caca0057285f970c',NULL,'pending','2026-11-03 12:28:08',NULL),(29,29,'254711000005',1500.00,'ws_CO_de5c87f8aea38b4a','MOCK8CB4F9','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(30,30,'254711000004',3000.00,'ws_CO_08a628b907ba0631','MOCK0BD154','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(31,31,'254711000004',3000.00,'ws_CO_f118b7d62f507bb8','MOCKFCE701','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(32,32,'254711000004',15000.00,'ws_CO_25a674c8e85b303d','MOCKE1EF72','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(33,33,'254711000002',4500.00,'ws_CO_b3a304cd87089b04','MOCK7D023A','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(34,34,'254711000002',4500.00,'ws_CO_04e40a9ea8c991cd','MOCKD7E32F','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(35,35,'254711000004',5000.00,'ws_CO_450015dc64d7ed17','MOCKFB23AD','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(36,36,'254711000003',3000.00,'ws_CO_2527ed2d1caaf2a7',NULL,'pending','2026-11-03 12:28:08',NULL),(37,37,'254711000004',1500.00,'ws_CO_34f989a4eb13daf3',NULL,'pending','2026-11-03 12:28:08',NULL),(38,38,'254711000002',1500.00,'ws_CO_4b238a9983944045','MOCK22E951','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(39,39,'254711000005',3000.00,'ws_CO_4981f0f3782bcbcb','MOCK2E60CD','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(40,40,'254711000005',1500.00,'ws_CO_2c31f9600fba9467','MOCKC475D5','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(41,41,'254711000003',10000.00,'ws_CO_a2b9b6661228c194','MOCKEFF2E3','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(42,42,'254711000005',3000.00,'ws_CO_45063ce846d28cb0','MOCKE4DF18','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(43,43,'254711000001',4500.00,'ws_CO_646cbd5cef2b3239',NULL,'pending','2026-11-03 12:28:08',NULL),(44,44,'254711000001',4500.00,'ws_CO_d6f3a4a9fc1f0595','MOCKDD8D86','success','2026-11-03 12:28:08','2026-11-03 12:28:08'),(45,45,'254711000001',1500.00,'ws_CO_b8278ef6516754c6','MOCK5B048A','success','2026-11-03 12:28:09','2026-11-03 12:28:09'),(46,46,'254711000001',15000.00,'ws_CO_5acf4a91a31bdbc7',NULL,'pending','2026-11-03 12:28:09',NULL),(47,47,'254711000004',4500.00,'ws_CO_cbd8a3fd7f62b0bb','MOCKFF1F0B','success','2026-11-03 12:28:09','2026-11-03 12:28:09'),(48,48,'254711000005',4500.00,'ws_CO_5578f13f39403156',NULL,'pending','2026-11-03 12:28:09',NULL),(49,49,'254711000001',5000.00,'ws_CO_a3b41679a2583406',NULL,'pending','2026-11-03 12:28:09',NULL),(50,50,'254711000003',1500.00,'ws_CO_694341a853091732','MOCK296706','success','2026-11-03 12:28:09','2026-11-03 12:28:09'),(51,51,'254711000005',15000.00,'ws_CO_92e7ff2335940404','MOCK0C3B1D','success','2026-11-03 12:28:09','2026-11-03 12:28:09'),(52,52,'254711000003',4500.00,'ws_CO_437e0cfbad969fad','MOCK9DF199','success','2026-11-03 12:28:09','2026-11-03 12:28:09'),(53,53,'254711000002',1500.00,'ws_CO_0197f41eb0d32619','MOCK5998C1','success','2026-11-03 12:28:09','2026-11-03 12:28:09'),(54,54,'254711000003',3000.00,'ws_CO_4b220e57ea797abd',NULL,'pending','2026-11-03 12:28:09',NULL),(55,55,'254711000003',1500.00,'ws_CO_10c3d24898c69255','MOCK677FE5','success','2026-11-03 12:28:09','2026-11-03 12:28:09'),(56,56,'254711000005',10000.00,'ws_CO_5ac59b60921c187a',NULL,'pending','2026-11-03 12:28:09',NULL),(57,57,'254711000005',3000.00,'ws_CO_24437fcd1498d520','MOCK06DE23','success','2026-11-03 12:28:09','2026-11-03 12:28:09');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_types`
--

DROP TABLE IF EXISTS `ticket_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_types` (
  `ticket_type_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity_total` int NOT NULL,
  PRIMARY KEY (`ticket_type_id`),
  UNIQUE KEY `event_id` (`event_id`,`name`),
  CONSTRAINT `ticket_types_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE RESTRICT,
  CONSTRAINT `ticket_types_chk_1` CHECK ((`price` >= 0)),
  CONSTRAINT `ticket_types_chk_2` CHECK ((`quantity_total` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_types`
--

LOCK TABLES `ticket_types` WRITE;
/*!40000 ALTER TABLE `ticket_types` DISABLE KEYS */;
INSERT INTO `ticket_types` VALUES (1,1,'Regular',1500.00,100),(2,1,'VIP',1500.00,20),(3,2,'Regular',1500.00,200),(4,2,'VIP',5000.00,50),(5,3,'Regular',1500.00,200),(6,3,'VIP',5000.00,50),(7,4,'Regular',1500.00,200),(8,4,'VIP',5000.00,50),(9,5,'Regular',1500.00,200),(10,5,'VIP',5000.00,50),(11,6,'Regular',1500.00,200),(12,6,'VIP',5000.00,50),(13,7,'Regular',1500.00,200),(14,7,'VIP',5000.00,50),(15,8,'Regular',1500.00,200),(16,8,'VIP',5000.00,50),(17,9,'Regular',1500.00,200),(18,9,'VIP',5000.00,50),(19,10,'Regular',1500.00,200),(20,10,'VIP',5000.00,50),(21,11,'Regular',1500.00,200),(22,11,'VIP',5000.00,50),(23,12,'Regular',1500.00,200),(24,12,'VIP',5000.00,50),(25,13,'Regular',1500.00,200),(26,13,'VIP',5000.00,50),(27,14,'Regular',1500.00,200),(28,14,'VIP',5000.00,50),(29,15,'Regular',1500.00,200),(30,15,'VIP',5000.00,50),(31,16,'Regular',1500.00,200),(32,16,'VIP',5000.00,50),(33,17,'Regular',1000.00,300),(34,17,'VIP',3500.00,50),(35,18,'Regular',1000.00,300),(36,18,'VIP',3500.00,50),(37,19,'Regular',1000.00,300),(38,19,'VIP',3500.00,50),(39,20,'Regular',1000.00,300),(40,20,'VIP',3500.00,50),(41,21,'Regular',1000.00,300),(42,21,'VIP',3500.00,50),(43,22,'Regular',1000.00,300),(44,22,'VIP',3500.00,50),(45,23,'Regular',1000.00,300),(46,23,'VIP',3500.00,50),(47,24,'Regular',1000.00,300),(48,24,'VIP',3500.00,50),(49,25,'Regular',1000.00,300),(50,25,'VIP',3500.00,50),(51,26,'Regular',1000.00,300),(52,26,'VIP',3500.00,50),(53,27,'Regular',1000.00,300),(54,27,'VIP',3500.00,50),(55,28,'Regular',1000.00,300),(56,28,'VIP',3500.00,50),(57,29,'Regular',1000.00,300),(58,29,'VIP',3500.00,50),(59,30,'Regular',1000.00,300),(60,30,'VIP',3500.00,50),(61,31,'Regular',1000.00,300),(62,31,'VIP',3500.00,50),(63,32,'Regular',1000.00,300),(64,32,'VIP',3500.00,50),(65,33,'Regular',1000.00,300),(66,33,'VIP',3500.00,50),(67,34,'Regular',1000.00,300),(68,34,'VIP',3500.00,50),(69,35,'Regular',1000.00,300),(70,35,'VIP',3500.00,50),(71,36,'Regular',1000.00,300),(72,36,'VIP',3500.00,50),(73,37,'Regular',1000.00,300),(74,37,'VIP',3500.00,50),(75,38,'Regular',1000.00,300),(76,38,'VIP',3500.00,50),(77,39,'Regular',1000.00,300),(78,39,'VIP',3500.00,50),(79,40,'Regular',1000.00,300),(80,40,'VIP',3500.00,50),(81,41,'Regular',1000.00,300),(82,41,'VIP',3500.00,50),(83,42,'Regular',1000.00,300),(84,42,'VIP',3500.00,50);
/*!40000 ALTER TABLE `ticket_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `reference_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qr_code` text COLLATE utf8mb4_unicode_ci,
  `status` enum('valid','used','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'valid',
  `checked_in_at` datetime DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  UNIQUE KEY `reference_code` (`reference_code`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,3,'TKT-082F48',NULL,'valid',NULL),(2,4,'TKT-547840',NULL,'valid',NULL),(3,4,'TKT-85676A',NULL,'valid',NULL),(4,4,'TKT-11AFF3',NULL,'valid',NULL),(5,4,'TKT-3D0367',NULL,'valid',NULL),(6,4,'TKT-78F289',NULL,'valid',NULL),(7,6,'TKT-0F8A7D',NULL,'valid',NULL),(8,7,'TKT-655419',NULL,'valid',NULL),(9,9,'TKT-83A9D4',NULL,'valid',NULL),(10,9,'TKT-B2CEAB',NULL,'valid',NULL),(11,9,'TKT-26B5B8',NULL,'valid',NULL),(12,10,'TKT-4A45DB',NULL,'valid',NULL),(13,10,'TKT-B242A8',NULL,'valid',NULL),(14,10,'TKT-3489E3',NULL,'valid',NULL),(15,11,'TKT-426459',NULL,'valid',NULL),(16,11,'TKT-C4BE15',NULL,'valid',NULL),(17,11,'TKT-375E1B',NULL,'valid',NULL),(18,12,'TKT-133DD7',NULL,'valid',NULL),(19,13,'TKT-F0DC29',NULL,'valid',NULL),(20,14,'TKT-7F97E4',NULL,'valid',NULL),(21,14,'TKT-3BB916',NULL,'valid',NULL),(22,16,'TKT-69DD04',NULL,'valid',NULL),(23,16,'TKT-B1D26B',NULL,'valid',NULL),(24,16,'TKT-3FD96C',NULL,'valid',NULL),(25,17,'TKT-775EDB',NULL,'valid',NULL),(26,17,'TKT-E75914',NULL,'valid',NULL),(27,17,'TKT-08F38B',NULL,'valid',NULL),(28,18,'TKT-1F6451',NULL,'valid',NULL),(29,18,'TKT-FC5B70',NULL,'valid',NULL),(30,18,'TKT-2AC88B',NULL,'valid',NULL),(31,19,'TKT-DB2B0D',NULL,'valid',NULL),(32,19,'TKT-AAFC35',NULL,'valid',NULL),(33,19,'TKT-5DE802',NULL,'valid',NULL),(34,20,'TKT-FC909A',NULL,'valid',NULL),(35,20,'TKT-AA48B8',NULL,'valid',NULL),(36,20,'TKT-812F13',NULL,'valid',NULL),(37,21,'TKT-81368B',NULL,'valid',NULL),(38,21,'TKT-2D593B',NULL,'valid',NULL),(39,23,'TKT-3EEF80',NULL,'valid',NULL),(40,23,'TKT-F58E7C',NULL,'valid',NULL),(41,23,'TKT-EDE84E',NULL,'valid',NULL),(42,25,'TKT-A516C6',NULL,'valid',NULL),(43,25,'TKT-5EF2A8',NULL,'valid',NULL),(44,26,'TKT-27BA69',NULL,'valid',NULL),(45,27,'TKT-D1FF92',NULL,'valid',NULL),(46,29,'TKT-A0400E',NULL,'valid',NULL),(47,30,'TKT-906896',NULL,'valid',NULL),(48,30,'TKT-D2534A',NULL,'valid',NULL),(49,31,'TKT-F7B3FF',NULL,'valid',NULL),(50,31,'TKT-1BDFAD',NULL,'valid',NULL),(51,32,'TKT-EFBADB',NULL,'valid',NULL),(52,32,'TKT-74C4A3',NULL,'valid',NULL),(53,32,'TKT-C42742',NULL,'valid',NULL),(54,33,'TKT-5EBF4D',NULL,'valid',NULL),(55,33,'TKT-FC59DE',NULL,'valid',NULL),(56,33,'TKT-C18F13',NULL,'valid',NULL),(57,34,'TKT-97BF65',NULL,'valid',NULL),(58,34,'TKT-2CE79B',NULL,'valid',NULL),(59,34,'TKT-396E94',NULL,'valid',NULL),(60,35,'TKT-CCCEAE',NULL,'valid',NULL),(61,38,'TKT-9EEF23',NULL,'valid',NULL),(62,39,'TKT-B3429E',NULL,'valid',NULL),(63,39,'TKT-F6F8DD',NULL,'valid',NULL),(64,40,'TKT-28C2C8',NULL,'valid',NULL),(65,41,'TKT-9E80AE',NULL,'valid',NULL),(66,41,'TKT-E04F7D',NULL,'valid',NULL),(67,42,'TKT-61F97B',NULL,'valid',NULL),(68,42,'TKT-CAB396',NULL,'valid',NULL),(69,44,'TKT-196E0E',NULL,'valid',NULL),(70,44,'TKT-19C94C',NULL,'valid',NULL),(71,44,'TKT-7FAD4E',NULL,'valid',NULL),(72,45,'TKT-E5A91F',NULL,'valid',NULL),(73,47,'TKT-416361',NULL,'valid',NULL),(74,47,'TKT-332E13',NULL,'valid',NULL),(75,47,'TKT-F87E31',NULL,'valid',NULL),(76,50,'TKT-3C9B22',NULL,'valid',NULL),(77,51,'TKT-D990BB',NULL,'valid',NULL),(78,51,'TKT-58CEC7',NULL,'valid',NULL),(79,51,'TKT-FAC34B',NULL,'valid',NULL),(80,52,'TKT-02F6F8',NULL,'valid',NULL),(81,52,'TKT-4C1194',NULL,'valid',NULL),(82,52,'TKT-6DD668',NULL,'valid',NULL),(83,53,'TKT-A0A8E0',NULL,'valid',NULL),(84,55,'TKT-9669FD',NULL,'valid',NULL),(85,57,'TKT-7B839E',NULL,'valid',NULL),(86,57,'TKT-9A573A',NULL,'valid',NULL);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `users_chk_1` CHECK (regexp_like(`phone_number`,_utf8mb4'^254[17][0-9]{8}$'))
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ashley Admin','ashleyotsiula@gmail.com','254712345678','$2b$10$GWJmKgeYdpEk4SM9m6sbX.CkR5Kc4AFOoLYJdvQGnhtBiDLZHLhXi','admin',1,'2026-10-28 08:47:06','2026-11-02 18:59:09'),(2,'Test Customer','testuser@eventgo.com','254706777549','$2b$10$jVWEr1nqB1BjCtrqYCojAubrc8WoGFlJFG4u5ATs8MC.Qcd/2KqI6','user',1,'2026-11-02 14:31:05','2026-11-02 17:42:26'),(4,'QR Test User','qrtest@eventgo.com','254711223344','$2b$10$zhinfLBLmW7CawzkQw/are.2YRsap//OpIqOJj9Fkg44fBCd7YuO2','user',1,'2026-11-03 12:10:49','2026-11-03 12:13:08'),(5,'Brian Kamau','brian@gmail.com','254711000001','$2b$10$lLGzEgyxeB8Sw7lw5G2bm.kS9iHGBZRUbIkmxs/57xf9ILz/zpFRq','user',1,'2026-11-03 12:28:07',NULL),(6,'Mercy Wanjiku','mercy@gmail.com','254711000002','$2b$10$lLGzEgyxeB8Sw7lw5G2bm.kS9iHGBZRUbIkmxs/57xf9ILz/zpFRq','user',1,'2026-11-03 12:28:07',NULL),(7,'David Ochieng','david@gmail.com','254711000003','$2b$10$lLGzEgyxeB8Sw7lw5G2bm.kS9iHGBZRUbIkmxs/57xf9ILz/zpFRq','user',1,'2026-11-03 12:28:07',NULL),(8,'Sarah Njeri','sarah@gmail.com','254711000004','$2b$10$lLGzEgyxeB8Sw7lw5G2bm.kS9iHGBZRUbIkmxs/57xf9ILz/zpFRq','user',1,'2026-11-03 12:28:07',NULL),(9,'Kevin Mutua','kevin@gmail.com','254711000005','$2b$10$lLGzEgyxeB8Sw7lw5G2bm.kS9iHGBZRUbIkmxs/57xf9ILz/zpFRq','user',1,'2026-11-03 12:28:07',NULL),(10,'Amina Odhiambo','amina.odhiambo@gmail.com','254720100001','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(11,'Brian Onyango','brian.onyango@gmail.com','254720100002','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(12,'Cynthia Wambui','cynthia.wambui@gmail.com','254720100003','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(13,'David Kiprop','david.kiprop@gmail.com','254720100004','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(14,'Esther Achieng','esther.achieng@gmail.com','254720100005','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(15,'Faisal Mohamed','faisal.mohamed@gmail.com','254720100006','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(16,'Grace Muthoni','grace.muthoni@gmail.com','254720100007','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(17,'Hassan Abdi','hassan.abdi@gmail.com','254720100008','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(18,'Irene Chebet','irene.chebet@gmail.com','254720100009','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(19,'James Omondi','james.omondi@gmail.com','254720100010','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(20,'Khadija Ali','khadija.ali@gmail.com','254720100011','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(21,'Lilian Atieno','lilian.atieno@gmail.com','254720100012','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(22,'Martin Kariuki','martin.kariuki@gmail.com','254720100013','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(23,'Nancy Wairimu','nancy.wairimu@gmail.com','254720100014','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:12',NULL),(24,'Oscar Mwangi','oscar.mwangi@gmail.com','254720100015','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:13',NULL),(25,'Purity Nyambura','purity.nyambura@gmail.com','254720100016','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:13',NULL),(26,'Quinter Akinyi','quinter.akinyi@gmail.com','254720100017','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:13',NULL),(27,'Robert Wafula','robert.wafula@gmail.com','254720100018','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:13',NULL),(28,'Sylvia Nasimiyu','sylvia.nasimiyu@gmail.com','254720100019','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:13',NULL),(29,'Timothy Kilonzo','timothy.kilonzo@gmail.com','254720100020','$2b$10$CohiZx8heim/nQ/P.3BYUen0qwh8IiW1s0nEi/gjWasg0/L5sth8y','user',1,'2026-11-03 12:54:13',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-03 17:12:46
