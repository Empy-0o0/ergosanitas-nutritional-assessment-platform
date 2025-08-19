import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Importar tipos y utilidades del proyecto
interface FoodItem {
  id: string;
  name: string;
  category: 'cereales' | 'proteinas' | 'lacteos' | 'frutas' | 'verduras' | 'grasas' | 'leguminosas' | 'azucares' | 'bebidas';
  calories: number;
  macronutrients: {
    protein: number;
    carbohydrates: number;
    fats: number;
    fiber: number;
    sugar: number;
  };
  micronutrients: {
    sodium: number;
    potassium: number;
    calcium: number;
    iron: number;
    vitaminC: number;
    vitaminA: number;
  };
  portionSize: {
    standard: number;
    description: string;
  };
  glycemicIndex?: number;
  allergens: string[];
}

// Función para generar ID único
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Función para normalizar categorías del Excel a nuestras categorías permitidas
function normalizeCategory(excelCategory: string, foodName: string): FoodItem['category'] {
  const catLower = excelCategory.toLowerCase();
  const nameLower = foodName.toLowerCase();
  
  // Mapeo específico basado en las categorías encontradas en el Excel
  if (catLower.includes('cereal')) return 'cereales';
  if (catLower.includes('fruta')) return 'frutas';
  if (catLower.includes('verdura')) return 'verduras';
  if (catLower.includes('leguminosas')) return 'leguminosas';
  if (catLower.includes('leche') || catLower.includes('lácteo')) return 'lacteos';
  if (catLower.includes('azúcar') || catLower.includes('azucar')) return 'azucares';
  if (catLower.includes('grasa')) return 'grasas';
  if (catLower.includes('alcohol')) return 'bebidas';
  
  // Categorías específicas del Excel
  if (catLower.includes('aoa')) return 'proteinas'; // Alimentos de Origen Animal
  if (catLower.includes('libres en energía')) return 'bebidas';
  
  // Casos especiales basados en el nombre del alimento
  if (nameLower.includes('agua') || nameLower.includes('té') || nameLower.includes('cafe')) return 'bebidas';
  if (nameLower.includes('aceite') || nameLower.includes('mantequilla') || nameLower.includes('aguacate')) return 'grasas';
  if (nameLower.includes('pollo') || nameLower.includes('carne') || nameLower.includes('pescado') || 
      nameLower.includes('huevo') || nameLower.includes('atún') || nameLower.includes('camarón')) return 'proteinas';
  
  // Fallback por defecto
  return 'proteinas';
}

// Función para parsear valores numéricos con fallback
function parseNumeric(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Función para limpiar y formatear nombres de alimentos
function cleanFoodName(name: string): string {
  if (!name || typeof name !== 'string') return 'Alimento sin nombre';
  return name.trim().replace(/\s+/g, ' ');
}

// Función principal para convertir Excel a JSON
function convertExcelToFoodItems(excelFilePath: string): FoodItem[] {
  try {
    console.log('Leyendo archivo Excel:', excelFilePath);
    
    // Leer el archivo Excel
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Procesando ${jsonData.length} filas del Excel...`);
    
    const foodItems: FoodItem[] = [];
    let processedCount = 0;
    let errorCount = 0;
    
    jsonData.forEach((row: any, index: number) => {
      try {
        // Extraer datos de la fila
        const foodName = cleanFoodName(row['Alimento']);
        const category = row['Categoria'] || '';
        const cantidad = row['Cantidad'] || '';
        const unidad = row['Unidad'] || '';
        const pesoNeto = parseNumeric(row['Peso neto g']);
        const pesoBruto = parseNumeric(row['Peso bruto g']);
        
        // Valores nutricionales
        const energia = parseNumeric(row['Energía']);
        const proteinas = parseNumeric(row['Proteínas']);
        const lipidos = parseNumeric(row['Lípidos']);
        const carbohidratos = parseNumeric(row['Carbohidratos']);
        const fibra = parseNumeric(row['Fibra g']);
        const azucar = parseNumeric(row['Azúcar (g)']);
        
        // Micronutrientes
        const sodio = parseNumeric(row['Sodio (mg)']);
        const potasio = parseNumeric(row['Potasio (mg)']);
        const calcio = parseNumeric(row['Calcio (mg)']);
        const hierro = parseNumeric(row['Hierro (mg)']);
        const vitaminaC = parseNumeric(row['Ácido ascórbico (mg)']);
        const vitaminaA = parseNumeric(row['Vitamina A (mg RE)']);
        
        // Índice glucémico
        const ig = parseNumeric(row['IG']);
        
        // Crear descripción de porción
        const portionWeight = pesoNeto > 0 ? pesoNeto : (pesoBruto > 0 ? pesoBruto : 100);
        const portionDescription = cantidad && unidad ? 
          `${cantidad} ${unidad}` : 
          `${portionWeight}g`;
        
        // Crear objeto FoodItem
        const foodItem: FoodItem = {
          id: generateId(),
          name: foodName,
          category: normalizeCategory(category, foodName),
          calories: energia,
          macronutrients: {
            protein: proteinas,
            carbohydrates: carbohidratos,
            fats: lipidos,
            fiber: fibra,
            sugar: azucar
          },
          micronutrients: {
            sodium: sodio,
            potassium: potasio,
            calcium: calcio,
            iron: hierro,
            vitaminC: vitaminaC,
            vitaminA: vitaminaA
          },
          portionSize: {
            standard: portionWeight,
            description: portionDescription
          },
          glycemicIndex: ig > 0 ? ig : undefined,
          allergens: []
        };
        
        foodItems.push(foodItem);
        processedCount++;
        
        // Log de progreso cada 100 elementos
        if (processedCount % 100 === 0) {
          console.log(`Procesados ${processedCount} alimentos...`);
        }
        
      } catch (error) {
        errorCount++;
        console.error(`Error procesando fila ${index + 1}:`, error);
        console.error('Datos de la fila:', row);
      }
    });
    
    console.log(`\n=== RESUMEN DE CONVERSIÓN ===`);
    console.log(`Total de filas procesadas: ${jsonData.length}`);
    console.log(`Alimentos convertidos exitosamente: ${processedCount}`);
    console.log(`Errores encontrados: ${errorCount}`);
    
    // Mostrar estadísticas por categoría
    const categoryStats: Record<string, number> = {};
    foodItems.forEach(item => {
      categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
    });
    
    console.log('\n=== DISTRIBUCIÓN POR CATEGORÍAS ===');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`${category}: ${count} alimentos`);
    });
    
    return foodItems;
    
  } catch (error) {
    console.error('Error leyendo el archivo Excel:', error);
    throw error;
  }
}

// Función para generar el archivo TypeScript
function generateTypeScriptFile(foodItems: FoodItem[], outputPath: string): void {
  const tsContent = `import { FoodItem } from '@/lib/types';

// Base de datos de alimentos generada automáticamente desde basealimentos.xlsx
// Total de alimentos: ${foodItems.length}
// Generado el: ${new Date().toISOString()}

export const extraFoodDatabase: FoodItem[] = ${JSON.stringify(foodItems, null, 2)};

// Estadísticas de la base de datos
export const foodDatabaseStats = {
  totalFoods: ${foodItems.length},
  generatedAt: '${new Date().toISOString()}',
  categories: {
${Object.entries(foodItems.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>)).map(([cat, count]) => `    ${cat}: ${count}`).join(',\n')}
  }
};
`;

  fs.writeFileSync(outputPath, tsContent, 'utf8');
  console.log(`\nArchivo TypeScript generado: ${outputPath}`);
}

// Función principal
function main() {
  try {
    const excelPath = path.join(process.cwd(), 'basealimentos.xlsx');
    const outputPath = path.join(process.cwd(), 'src', 'data', 'foodDatabaseExtra.ts');
    
    // Verificar que el archivo Excel existe
    if (!fs.existsSync(excelPath)) {
      throw new Error(`Archivo Excel no encontrado: ${excelPath}`);
    }
    
    // Crear directorio de salida si no existe
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log('=== INICIANDO CONVERSIÓN DE EXCEL A TYPESCRIPT ===\n');
    
    // Convertir Excel a FoodItems
    const foodItems = convertExcelToFoodItems(excelPath);
    
    // Generar archivo TypeScript
    generateTypeScriptFile(foodItems, outputPath);
    
    console.log('\n=== CONVERSIÓN COMPLETADA EXITOSAMENTE ===');
    console.log(`Se han procesado ${foodItems.length} alimentos`);
    console.log(`Archivo generado: ${outputPath}`);
    
  } catch (error) {
    console.error('\n=== ERROR EN LA CONVERSIÓN ===');
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

export { convertExcelToFoodItems, normalizeCategory, generateTypeScriptFile };
