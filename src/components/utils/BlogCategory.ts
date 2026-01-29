function formatCategory(catKey?: string | null): string {
  switch (catKey) {
    case 'forecast':
      return 'Прогноз'
    case 'education':
      return 'Обучение'
    case 'esoterics':
      return 'Эзотерика'
    default:
      return 'Новости'
  }
}
