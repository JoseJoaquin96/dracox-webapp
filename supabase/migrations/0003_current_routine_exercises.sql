begin;

-- Exercise catalog required by the current four-day routine.
-- These rows are global and can be used by every authenticated user.
insert into public.exercises (id, name, muscle, secondary, equipment, kind, initials, color)
values
  ('90000000-0000-4000-8000-000000000001', 'Press inclinado en máquina', 'Pecho', 'Tríceps · Hombro', 'Máquina', 'strength', 'PM', '#f1a65b'),
  ('90000000-0000-4000-8000-000000000002', 'Press horizontal en máquina', 'Pecho', 'Tríceps · Hombro', 'Máquina', 'strength', 'PH', '#efa06f'),
  ('90000000-0000-4000-8000-000000000003', 'Jalón al pecho agarre neutro', 'Espalda', 'Bíceps', 'Polea', 'strength', 'JN', '#72b6ff'),
  ('90000000-0000-4000-8000-000000000004', 'Remo con pecho apoyado', 'Espalda', 'Bíceps · Core', 'Máquina', 'strength', 'RP', '#8c7bff'),
  ('90000000-0000-4000-8000-000000000005', 'Aperturas en polea', 'Pecho', '—', 'Polea', 'strength', 'AP', '#e98caa'),
  ('90000000-0000-4000-8000-000000000006', 'Elevaciones laterales', 'Hombros', 'Deltoide lateral', 'Mancuernas', 'strength', 'EL', '#b4a0f5'),
  ('90000000-0000-4000-8000-000000000007', 'Curl bíceps en banco inclinado', 'Bíceps', '—', 'Mancuernas', 'strength', 'CB', '#a99bff'),
  ('90000000-0000-4000-8000-000000000008', 'Extensión tríceps cuerda', 'Tríceps', '—', 'Polea', 'strength', 'ET', '#9bdcba'),
  ('90000000-0000-4000-8000-000000000009', 'Prensa de piernas', 'Piernas', 'Cuádriceps · Glúteo', 'Máquina', 'strength', 'PP', '#b5e46c'),
  ('90000000-0000-4000-8000-000000000010', 'Extensión de cuádriceps', 'Cuádriceps', '—', 'Máquina', 'strength', 'EC', '#91d4ba'),
  ('90000000-0000-4000-8000-000000000011', 'Curl femoral sentado', 'Isquios', '—', 'Máquina', 'strength', 'CF', '#efa06f'),
  ('90000000-0000-4000-8000-000000000012', 'Hip thrust en máquina', 'Glúteo', 'Isquios · Cuádriceps', 'Máquina', 'strength', 'HT', '#d8f36a'),
  ('90000000-0000-4000-8000-000000000013', 'Extensión de gemelos sentado', 'Gemelos', 'Sóleo', 'Máquina', 'strength', 'GS', '#72b6ff'),
  ('90000000-0000-4000-8000-000000000014', 'Crunch en máquina', 'Core', 'Abdominales', 'Máquina', 'strength', 'CM', '#b4a0f5'),
  ('90000000-0000-4000-8000-000000000015', 'Press inclinado con mancuernas', 'Pecho', 'Tríceps · Hombro', 'Mancuernas', 'strength', 'PM', '#f1a65b'),
  ('90000000-0000-4000-8000-000000000016', 'Jalón unilateral en polea', 'Espalda', 'Bíceps', 'Polea', 'strength', 'JU', '#72b6ff'),
  ('90000000-0000-4000-8000-000000000017', 'Remo unilateral en máquina/polea', 'Espalda', 'Bíceps · Core', 'Máquina / Polea', 'strength', 'RU', '#8c7bff'),
  ('90000000-0000-4000-8000-000000000018', 'Elevaciones laterales en polea', 'Hombros', 'Deltoide lateral', 'Polea', 'strength', 'EP', '#b4a0f5'),
  ('90000000-0000-4000-8000-000000000019', 'Reverse pec-deck', 'Hombros', 'Deltoide posterior', 'Máquina', 'strength', 'RP', '#e98caa'),
  ('90000000-0000-4000-8000-000000000020', 'Curl martillo', 'Bíceps', 'Braquial · Antebrazo', 'Mancuernas', 'strength', 'CM', '#a99bff'),
  ('90000000-0000-4000-8000-000000000021', 'Extensión de tríceps por encima de la cabeza', 'Tríceps', '—', 'Polea', 'strength', 'ET', '#9bdcba'),
  ('90000000-0000-4000-8000-000000000022', 'Prensa unilateral', 'Piernas', 'Cuádriceps · Glúteo', 'Máquina', 'strength', 'PU', '#b5e46c'),
  ('90000000-0000-4000-8000-000000000023', 'Curl femoral tumbado', 'Isquios', '—', 'Máquina', 'strength', 'CT', '#efa06f'),
  ('90000000-0000-4000-8000-000000000024', 'Gemelo de pie', 'Gemelos', 'Gastrocnemio', 'Máquina', 'strength', 'GP', '#91d4ba'),
  ('90000000-0000-4000-8000-000000000025', 'Curl bíceps en polea', 'Bíceps', '—', 'Polea', 'strength', 'CP', '#a99bff')
on conflict (id) do nothing;

commit;
