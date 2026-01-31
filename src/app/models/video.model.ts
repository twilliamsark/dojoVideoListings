export interface Video {
  id: string;

  name: string;

  url: string;

  technique:
    | 'Bokken Suburi'
    | 'General Exercise'
    | 'Gokyo'
    | 'Hiji Kata'
    | 'Iaido Only'
    | 'Ikkyo'
    | 'Iriminage'
    | 'Jo Kata'
    | 'Kaitennage'
    | 'Kokyuho'
    | 'Kokyunage'
    | 'Kotegaeshi'
    | 'Nikyo'
    | 'Sankyo'
    | 'Shihonage'
    | 'Udekimenage';

  direction?: 'Omote' | 'Ura';

  stance?: 'Aihanmi' | 'Gyakuhanmi';

  format:
    | 'Aiki Toho'
    | 'Jo no Tebiki'
    | 'Ken no Tebiki'
    | 'Ken ti Jo'
    | 'Ken ti Ken'
    | 'Other'
    | 'Oyo'
    | 'Suwariwaza'
    | 'Tiado';
}
