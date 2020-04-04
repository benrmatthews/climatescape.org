import React, { useState } from "react"
import {
  OrganizationCategory,
  OrganizationLocation,
  OrganizationHeadcount,
  OrganizationOrgType,
  OrganizationCapitalType,
  OrganizationCapitalStrategic,
  OrganizationCapitalStage,
  OrganizationCapitalCheckSize,
} from "./OrganizationAttributes"

import Select from "react-select"

export const useOrganizationFilterState = () => {
  const [byCategory, setCategoryFilter] = useState(null)
  const [byLocation, setLocationFilter] = useState(null)
  const [byHeadcount, setHeadcountFilter] = useState(null)
  const [byOrgType, setOrgTypeFilter] = useState(null)
  const [byCapitalType, setCapitalTypeFilter] = useState(null)
  const [byCapitalStrategic, setCapitalStrategicFilter] = useState(null)
  const [byCapitalStage, setCapitalStageFilter] = useState(null)
  const [byCapitalCheckSize, setCapitalCheckSizeFilter] = useState(null)

  const setFilter = {
    byCategory: setCategoryFilter,
    byLocation: setLocationFilter,
    byHeadcount: setHeadcountFilter,
    byOrgType: setOrgTypeFilter,
    byCapitalType: setCapitalTypeFilter,
    byCapitalStrategic: setCapitalStrategicFilter,
    byCapitalStage: setCapitalStageFilter,
    byCapitalCheckSize: setCapitalCheckSizeFilter,
    none: () => {
      setCategoryFilter(null)
      setLocationFilter(null)
      setHeadcountFilter(null)
      setOrgTypeFilter(null)
      setCapitalTypeFilter(null)
      setCapitalStrategicFilter(null)
      setCapitalStageFilter(null)
      setCapitalCheckSizeFilter(null)
    },
  }

  const applyFilter = organizations => {
    if (byCategory)
      organizations = organizations.filter(org =>
        org.categories.find(cat => cat.id === byCategory?.id)
      )

    if (byLocation)
      organizations = organizations.filter(org => org.location === byLocation)

    if (byHeadcount)
      organizations = organizations.filter(org => org.headcount === byHeadcount)

    if (byOrgType)
      organizations = organizations.filter(org => org.orgType === byOrgType)

    if (byCapitalType)
      organizations = organizations.filter(
        org => org.capitalProfile?.type?.indexOf(byCapitalType) >= 0
      )

    if (byCapitalStrategic)
      organizations = organizations.filter(
        org => org.capitalProfile?.strategic === byCapitalStrategic
      )

    if (byCapitalStage)
      organizations = organizations.filter(
        org => org.capitalProfile?.stage?.indexOf(byCapitalStage) >= 0
      )

    if (byCapitalCheckSize)
      organizations = organizations.filter(
        org => org.capitalProfile?.checkSize?.indexOf(byCapitalCheckSize) >= 0
      )

    return organizations
  }

  return [
    {
      byCategory,
      byLocation,
      byHeadcount,
      byOrgType,
      byCapitalType,
      byCapitalStrategic,
      byCapitalStage,
      byCapitalCheckSize,
    },
    setFilter,
    applyFilter,
  ]
}

const formatSubcategoryOptions = (categories, pageContext) => {
  let subCategories = categories
    .filter(
      category =>
        pageContext.categoryId === category.parent?.id && category.count > 0
    )
    .map(result => ({
      value: result,
      label: result.name,
    }))

  return [{ value: null, label: "None" }, ...subCategories]
}

const formatHeadcounts = organizations => {
  let formatted = organizations
    .reduce((array, organization) => {
      let { headcount } = organization
      return array.includes(headcount) || headcount == null
        ? array
        : [...array, headcount]
    }, [])
    .map(result => ({
      value: result,
      label: result,
    }))

  formatted.unshift({ value: null, label: "None" })

  return formatted
}

const formatOrgTypes = organizations => {
  let formatted = organizations
    .reduce((array, organization) => {
      let { orgType } = organization
      return array.includes(orgType) || orgType == null
        ? array
        : [...array, orgType]
    }, [])
    .map(result => ({
      value: result,
      label: result,
    }))

  formatted.unshift({ value: null, label: "None" })

  return formatted
}

const OrganizationFilter = ({
  currentFilter,
  categories,
  pageContext,
  onApplyFilter,
  organizations,
}) => {
  const {
    byCategory,
    byLocation,
    byHeadcount,
    byOrgType,
    byCapitalType,
    byCapitalStrategic,
    byCapitalStage,
    byCapitalCheckSize,
  } = currentFilter

  const hasFilterApplied =
    byCategory ||
    byLocation ||
    byHeadcount ||
    byOrgType ||
    byCapitalType ||
    byCapitalStrategic ||
    byCapitalStage ||
    byCapitalCheckSize

  const formattedSubcategories = pageContext
    ? formatSubcategoryOptions(categories, pageContext)
    : null

  const formattedHeadCounts = pageContext
    ? formatHeadcounts(organizations)
    : null
  const formattedOrgTypes = pageContext ? formatOrgTypes(organizations) : null

  const styles = {
    container: styles => ({
      ...styles,
      display: "inline-block",
      marginRight: "8px",
      maxWidth: "30%",
      maxHeight: "24px",
      verticalAlign: "middle",
    }),
    control: provided => ({
      ...provided,
      minHeight: "24px",
      maxHeight: "24px",
      borderRadius: "9999px",
      maxWidth: "100%",
    }),
    indicatorsContainer: provided => ({
      ...provided,
      height: "24px",
    }),
    indicatorSeparator: provided => ({
      ...provided,
      display: "none",
    }),
    clearIndicator: provided => ({
      ...provided,
      padding: "5px",
    }),
    dropdownIndicator: provided => ({
      ...provided,
      padding: "5px",
    }),
    placeholder: provided => ({
      ...provided,
      position: "static",
      top: "auto",
      transform: "none",
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxHeight: "24px",
      whiteSpace: "nowrap",
    }),
    option: provided => ({
      ...provided,
      maxWidth: "none",
    }),
    singleValue: provided => ({
      ...provided,
      maxWidth: "none",
      position: "static",
      top: "auto",
      transform: "none",
    }),
    valueContainer: provided => ({
      ...provided,
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    }),
  }

  return (
    <>
      {
        <div className="text-gray-700  text-sm max-w-6xl mt-3">
          <span className="mr-2 inline-block h-6 min-h-full">
            <span>{organizations?.length} Companies | </span>
            Filter by
          </span>
          <Select
            options={formattedSubcategories}
            onChange={category => onApplyFilter.byCategory(category?.value)}
            styles={styles}
            isSearchable={false}
            placeholder={byCategory ? byCategory.name : "Sub category"}
            value={byCategory ? byCategory.name : null}
          />

          <Select
            options={formattedHeadCounts}
            onChange={size => onApplyFilter.byHeadcount(size?.value)}
            styles={styles}
            isSearchable={false}
            placeholder={byHeadcount || "Size"}
            value={byHeadcount}
          />
          <Select
            options={formattedOrgTypes}
            onChange={orgType => onApplyFilter.byOrgType(orgType?.value)}
            styles={styles}
            isSearchable={false}
            placeholder={byOrgType || "Org Type"}
            value={byOrgType}
          />
        </div>
      }
    </>
  )
}

export default OrganizationFilter
