export const validateHashString = (str: string): string | null => {
  if (!str.trim()) {
    return 'Строка не может быть пустой';
  }
  
  // Проверка на SQL инъекции 
  const sqlInjectionPattern = /('|"|;|--|\/\*|\*\/|xp_|sp_|exec|execute|insert|select|delete|update|drop|union|into|load_file|outfile)/i;
  if (sqlInjectionPattern.test(str)) {
    return 'Недопустимые символы в строке';
  }

  return null;
}; 