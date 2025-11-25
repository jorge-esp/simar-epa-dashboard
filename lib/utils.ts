/**
 * Función de utilidad para combinar clases CSS de forma condicional
 * Sin dependencias externas - solo manipulación nativa de JavaScript
 * @param inputs - Array de valores de clase (strings, objetos booleanos, arrays)
 * @returns String con todas las clases combinadas
 * 
 * Ejemplos:
 * cn('base-class', condition && 'conditional-class')
 * cn('text-lg', someBoolean && 'font-bold')
 */
export function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ')
}
