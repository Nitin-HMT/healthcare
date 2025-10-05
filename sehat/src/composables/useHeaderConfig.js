import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useHeaderConfig() {
  const route = useRoute()
//  console.log("i am being called again")

  const currentDept = computed(() => {
//    console.log("i am firing dept")
    const dept = route.path.split('/')[1]
    return ['opd', 'ipd', 'pharmacy'].includes(dept) ? dept : 'opd'
  })

  const configMap = {
      opd: () => ({
    title: 'Clinic',
    subtitle: 'Outpatient Department',
    tabs: [
      { label: 'Home', to: '/opd' },
    ],
    showPatientSearch: true, // 👈 NEW
  }),
  ipd: () => ({
    title: 'IPD',
    subtitle: 'Inpatient Department',
    tabs: [
      { label: 'Admit', to: '/ipd' },
      { label: 'Manage', to: '/ipd/manage' },
      { label: 'Billing', to: '/ipd/billing' },
    ],
    showPatientSearch: false,
  }),
    pharmacy: () => ({
      title: 'Pharmacy',
      subtitle: 'Medication Dispensary',
      tabs: [
        { label: 'Inventory', to: '/pharmacy' },
        { label: 'Sales', to: '/pharmacy/sales' },
        { label: 'Returns', to: '/pharmacy/returns' },
      ],
    showPatientSearch: false,
    })
  }

let { title, subtitle, tabs, showPatientSearch } = computed(() => {
//  console.log("i am firing")
  const config = configMap[currentDept.value]?.() || {}
  return {
    title: config.title || "Doctor's on Cloud",
    subtitle: config.subtitle || '',
    tabs: config.tabs || [],
    showPatientSearch: config.showPatientSearch || false
  }
}).value

return { title, subtitle, tabs, showPatientSearch }
}
