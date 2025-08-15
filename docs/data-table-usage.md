# DataTable Component - Guía de Uso

## Descripción

El componente `DataTable` es una tabla reutilizable y altamente configurable que proporciona funcionalidades avanzadas como ordenamiento, paginación, búsqueda y selección de columnas.

## Características

- ✅ **Ordenamiento**: Ordenamiento local por columnas
- ✅ **Paginación**: Paginación local con controles completos
- ✅ **Búsqueda**: Búsqueda global en todos los campos
- ✅ **Selección de columnas**: Mostrar/ocultar columnas dinámicamente
- ✅ **Estados de carga**: Loading states y manejo de errores
- ✅ **Responsive**: Diseño adaptativo para diferentes pantallas
- ✅ **Personalizable**: Estilos y comportamientos configurables
- ✅ **TypeScript**: Soporte completo de tipos

## Instalación

Los componentes ya están disponibles en:
- `@/components/ui/data-table` - Componente principal
- `@/hooks/use-data-table` - Hook para lógica de tabla
- `@/types/table` - Tipos e interfaces

## Uso Básico

```tsx
import { DataTable } from "@/components/ui/data-table"
import { useDataTable } from "@/hooks/use-data-table"
import type { TableColumn } from "@/types/table"

interface User {
  id: string
  name: string
  email: string
  role: string
}

const columns: TableColumn<User>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true
  },
  {
    key: "email",
    label: "Email",
    sortable: true
  },
  {
    key: "role",
    label: "Role",
    sortable: true
  }
]

function UserTable({ users }: { users: User[] }) {
  const {
    paginatedData,
    sort,
    handleSort,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    searchTerm,
    handleSearchChange,
    visibleColumns,
    handleColumnVisibilityChange
  } = useDataTable({
    data: users,
    initialItemsPerPage: 10
  })

  return (
    <DataTable
      data={paginatedData}
      columns={columns}
      sort={sort}
      onSort={handleSort}
      pagination={pagination}
      onPageChange={handlePageChange}
      onItemsPerPageChange={handleItemsPerPageChange}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      visibleColumns={visibleColumns}
      onColumnVisibilityChange={handleColumnVisibilityChange}
      showColumnSelector={true}
      title="Users"
    />
  )
}
```

## Configuración de Columnas

### Propiedades de Columna

```tsx
interface TableColumn<T = any> {
  key: string                    // Clave única de la columna
  label: string                  // Etiqueta mostrada en el header
  sortable?: boolean            // Si la columna es ordenable
  width?: string                // Ancho de la columna
  align?: 'left' | 'center' | 'right'  // Alineación del contenido
  render?: (value: any, row: T, index: number) => React.ReactNode  // Renderizado personalizado
  formatter?: (value: any) => string   // Formateador de valores
}
```

### Ejemplos de Configuración

```tsx
const columns: TableColumn<User>[] = [
  // Columna básica
  {
    key: "name",
    label: "Name",
    sortable: true
  },
  
  // Columna con formateador
  {
    key: "createdAt",
    label: "Created At",
    sortable: true,
    formatter: (value) => format(new Date(value), "MMM dd, yyyy")
  },
  
  // Columna con renderizado personalizado
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <Badge variant={value === 'active' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    )
  },
  
  // Columna con ancho fijo y alineación
  {
    key: "amount",
    label: "Amount",
    width: "120px",
    align: "right",
    formatter: (value) => `$${value.toFixed(2)}`
  }
]
```

## Hook useDataTable

### Opciones

```tsx
interface UseDataTableOptions<T = any> {
  data: T[]                      // Datos de la tabla
  initialSort?: TableSort        // Ordenamiento inicial
  initialPage?: number           // Página inicial
  initialItemsPerPage?: number   // Elementos por página inicial
  searchable?: boolean          // Habilitar búsqueda
  sortable?: boolean            // Habilitar ordenamiento
  pagination?: boolean          // Habilitar paginación
  getRowId?: (row: T, index: number) => string  // Función para obtener ID de fila
}
```

### Retorno

```tsx
interface UseDataTableReturn<T = any> {
  processedData: T[]             // Datos procesados (filtrados y ordenados)
  paginatedData: T[]             // Datos paginados
  sort: TableSort | undefined    // Estado de ordenamiento
  handleSort: (column: string) => void
  pagination: TablePagination    // Estado de paginación
  handlePageChange: (page: number) => void
  handleItemsPerPageChange: (itemsPerPage: number) => void
  searchTerm: string             // Término de búsqueda
  handleSearchChange: (term: string) => void
  visibleColumns: Set<string>    // Columnas visibles
  handleColumnVisibilityChange: (column: string) => void
  setVisibleColumns: (columns: Set<string>) => void
  getRowId: (row: T, index: number) => string
}
```

## Props del DataTable

### Props Principales

```tsx
interface TableProps<T = any> {
  // Datos
  data: T[]                      // Datos a mostrar
  columns: TableColumn<T>[]      // Configuración de columnas
  
  // Estados
  loading?: boolean              // Estado de carga
  error?: string | null          // Mensaje de error
  
  // Ordenamiento
  sort?: TableSort               // Estado de ordenamiento
  onSort?: (column: string) => void
  
  // Paginación
  pagination?: TablePagination   // Estado de paginación
  onPageChange?: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  
  // Búsqueda
  searchTerm?: string            // Término de búsqueda
  onSearchChange?: (term: string) => void
  searchPlaceholder?: string     // Placeholder del campo de búsqueda
  
  // Columnas
  visibleColumns?: Set<string>   // Columnas visibles
  onColumnVisibilityChange?: (column: string) => void
  showColumnSelector?: boolean   // Mostrar selector de columnas
  
  // Estilos
  className?: string             // Clase del contenedor
  tableClassName?: string        // Clase de la tabla
  headerClassName?: string       // Clase del header
  rowClassName?: string          // Clase de las filas
  cellClassName?: string         // Clase de las celdas
  
  // Título
  title?: string                 // Título de la tabla
  titleIcon?: React.ReactNode    // Icono del título
}
```

## Ejemplos Avanzados

### Tabla con Selección de Filas

```tsx
function SelectableTable({ users }: { users: User[] }) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  
  const handleRowSelect = (rowId: string, selected: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(rowId)
      } else {
        newSet.delete(rowId)
      }
      return newSet
    })
  }
  
  return (
    <DataTable
      data={users}
      columns={columns}
      selectable={true}
      selectedRows={selectedRows}
      onRowSelect={handleRowSelect}
      // ... otras props
    />
  )
}
```

### Tabla con Estados Personalizados

```tsx
function CustomTable({ users }: { users: User[] }) {
  return (
    <DataTable
      data={users}
      columns={columns}
      loading={loading}
      error={error}
      emptyMessage="No users found"
      emptyIcon={<UserX className="h-8 w-8" />}
      loadingMessage="Loading users..."
      loadingIcon={<Loader2 className="h-8 w-8 animate-spin" />}
      // ... otras props
    />
  )
}
```

## Mejores Prácticas

### 1. Definir Tipos Correctamente

```tsx
// ✅ Correcto
interface User {
  id: string
  name: string
  email: string
}

const columns: TableColumn<User>[] = [...]

// ❌ Incorrecto
const columns: TableColumn[] = [...]
```

### 2. Usar Formatters para Datos Específicos

```tsx
// ✅ Para fechas
{
  key: "createdAt",
  label: "Created At",
  formatter: (value) => format(new Date(value), "MMM dd, yyyy")
}

// ✅ Para números
{
  key: "price",
  label: "Price",
  formatter: (value) => `$${value.toFixed(2)}`
}
```

### 3. Usar Render para Componentes Complejos

```tsx
// ✅ Para componentes complejos
{
  key: "actions",
  label: "Actions",
  render: (value, row) => (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => editUser(row.id)}>Edit</Button>
      <Button size="sm" variant="destructive" onClick={() => deleteUser(row.id)}>Delete</Button>
    </div>
  )
}
```

### 4. Manejar Estados de Carga y Error

```tsx
// ✅ Siempre manejar estados
<DataTable
  data={data}
  columns={columns}
  loading={loading}
  error={error}
  // ... otras props
/>
```

## Migración desde el Componente Anterior

### Antes (Componente Específico)

```tsx
// ❌ Código duplicado y específico
export function HistoricalDataTable({ dateRange }: HistoricalDataTableProps) {
  // 300+ líneas de código específico
  // Lógica de tabla mezclada con lógica de negocio
  // Difícil de reutilizar
}
```

### Después (Componente Reutilizable)

```tsx
// ✅ Código limpio y reutilizable
export function HistoricalDataTable({ dateRange }: HistoricalDataTableProps) {
  // Solo 100 líneas de código
  // Lógica de tabla separada en hook
  // Fácil de reutilizar y mantener
}
```

## Beneficios de la Refactorización

1. **Reutilización**: El mismo componente puede usarse en diferentes partes de la aplicación
2. **Mantenibilidad**: Código más limpio y fácil de mantener
3. **Consistencia**: Mismo comportamiento y apariencia en todas las tablas
4. **Flexibilidad**: Fácil personalización sin modificar el componente base
5. **Testing**: Más fácil de testear componentes más pequeños
6. **Performance**: Optimizaciones centralizadas en un solo lugar
