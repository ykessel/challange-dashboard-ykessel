export interface TableColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => React.ReactNode
  formatter?: (value: any) => string
}

export interface TableSort {
  column: string
  direction: 'asc' | 'desc' | null
}

export interface TablePagination {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export interface TableProps<T = any> {
  // Data
  data: T[]
  columns: TableColumn<T>[]
  
  // Loading and error states
  loading?: boolean
  error?: string | null
  
  // Sorting
  sort?: TableSort
  onSort?: (column: string) => void
  
  // Pagination
  pagination?: TablePagination
  onPageChange?: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  
  // Search
  searchTerm?: string
  onSearchChange?: (term: string) => void
  searchPlaceholder?: string
  
  // Column visibility
  visibleColumns?: Set<string>
  onColumnVisibilityChange?: (column: string) => void
  showColumnSelector?: boolean
  
  // Styling
  className?: string
  tableClassName?: string
  headerClassName?: string
  rowClassName?: string
  cellClassName?: string
  
  // Features
  selectable?: boolean
  selectedRows?: Set<string>
  onRowSelect?: (rowId: string, selected: boolean) => void
  onSelectAll?: (selected: boolean) => void
  
  // Empty state
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  
  // Loading state
  loadingMessage?: string
  loadingIcon?: React.ReactNode
}

export interface TableHeaderProps<T = any> {
  columns: TableColumn<T>[]
  sort?: TableSort
  onSort?: (column: string) => void
  className?: string
}

export interface TableBodyProps<T = any> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  className?: string
  rowClassName?: string
  cellClassName?: string
  getRowId?: (row: T, index: number) => string
}

export interface TablePaginationProps {
  pagination: TablePagination
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  className?: string
}

export interface TableSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export interface TableColumnSelectorProps<T = any> {
  columns: TableColumn<T>[]
  visibleColumns: Set<string>
  onColumnVisibilityChange: (column: string) => void
  className?: string
}
