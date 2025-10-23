INSERT INTO `secretariat` (`name`, `surname`, `email`, `landline`) VALUES
('Anna', 'Papadopoulou', 'apapadopoulou@upatras.gr', 2610320001),
('George', 'Nikolaidis', 'gnikolaidis@upatras.gr', 2610330002),
('Maria', 'Ioannidou', 'mioannidou@upatras.gr', 2610340003),
('Elena', 'Karapanou', 'ekarapanou@upatras.gr', 2610350004),
('Kostas', 'Zervas', 'kzervas@upatras.gr', 2610360005),
('Sofia', 'Petropoulou', 'spetropoulou@upatras.gr', 2610370006);

INSERT INTO `personnel` (`username`, `password`, `role`, `secretariat_id`) VALUES
('apapadopoulou', 'default_password', 'Secretariat', 1),
('gnikolaidis', 'default_password', 'Secretariat', 2),
('mioannidou', 'default_password', 'Secretariat', 3),
('ekarapanou', 'default_password', 'Secretariat', 4),
('kzervas', 'default_password', 'Secretariat', 5),
('spetropoulou', 'default_password', 'Secretariat', 6);
