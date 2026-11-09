export interface StudentData {
  id: string;
  name: string;
  seatId: string;
  gender: 'm' | 'f';
  skinTone: string;
  hairColor: string;
  hairStyle: 'short' | 'curly' | 'ponytail' | 'buzz';
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
  accessory?: 'orange' | 'lotus' | 'glasses' | 'scholar_hat' | 'red_bow' | 'none';
  capybaraTone?: string;
  // Desk grid coordinate in world space
  deskPosition: [number, number, number]; // [x, y, z]
}
