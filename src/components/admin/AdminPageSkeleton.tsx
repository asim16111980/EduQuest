/**
 * @file AdminPageSkeleton.tsx
 * @description Simple pulse skeleton shown while lazy loading admin pages.
 * @exports AdminPageSkeleton — loading placeholder with animated bars
 */
export function AdminPageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse" dir="rtl">
      <div className="h-8 bg-gray-200 rounded-xl w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-48 bg-gray-200 rounded-2xl" />
    </div>
  )
}
