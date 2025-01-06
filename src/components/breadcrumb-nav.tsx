import { useBreadcrumb } from '@/hooks/use-breadcrumb'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import React from 'react'

export function BreadcrumbNav() {
  const { breadcrumbs, navigate } = useBreadcrumb()

  return (
    <Breadcrumb suppressHydrationWarning>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.url || index}>
            <BreadcrumbItem key={`crumb-${index}`}>
              {crumb.url ? (
                <BreadcrumbLink
                  onClick={() => navigate(crumb.url!)}
                  className="cursor-pointer"
                >
                  {crumb.label}
                </BreadcrumbLink>
              ) : (
                <span className="text-muted-foreground">{crumb.label}</span>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator
              className="hidden md:block"
              key={`separator-${index}`}
            />
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
