import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { groupProjectsByMonth, type Project } from '@/lib/project-utils'
import { format, parseISO } from 'date-fns'

interface ProjectSelectProps {
  projects: Project[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showCustomerName?: boolean
  showAmount?: boolean
}

export function ProjectSelect({
  projects,
  value,
  onValueChange,
  placeholder = '案件を選択',
  disabled = false,
  className = '',
  showCustomerName = false,
  showAmount = false,
}: ProjectSelectProps) {
  const groupedProjects = groupProjectsByMonth(projects)

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        {groupedProjects.map(({ month, projects: monthProjects }) => (
          <SelectGroup key={month}>
            <SelectLabel className="font-bold text-sm text-gray-600 px-2 py-1.5">
              {month}
            </SelectLabel>
            {monthProjects.map((project) => (
              <SelectItem key={project.id} value={project.id} className="pl-4">
                <div className="flex flex-col">
                  <span className="font-medium">{project.project_name}</span>
                  {(showCustomerName || showAmount) && (
                    <div className="flex gap-2 text-xs text-gray-500">
                      {showCustomerName && project.customer_name && (
                        <span>{project.customer_name}</span>
                      )}
                      {showAmount && project.receivable_amount !== undefined && (
                        <span>¥{project.receivable_amount.toLocaleString()}</span>
                      )}
                    </div>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}