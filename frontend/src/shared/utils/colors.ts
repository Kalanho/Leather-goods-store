// Список доступных цветов для магазина
export const LEATHER_COLORS = [
    { name: 'Черный', hex: '#111111' },
    { name: 'Коричневый', hex: '#5C3A21' },
    { name: 'Cognac', hex: '#8B5A2B' },
    { name: 'Бордовый', hex: '#6B1D24' },
    { name: 'Бежевый', hex: '#D2B48C' },
    { name: 'Темно-зеленый', hex: '#2F4F4F' },
  ];
  
  export const getColorHex = (colorName: string) => {
    const color = LEATHER_COLORS.find((c) => c.name.toLowerCase() === colorName.toLowerCase());
    return color ? color.hex : '#cccccc'; // Серый, если цвет не найден
  };