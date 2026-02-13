import { createListResource, createResource } from "frappe-ui";
import { useUserStore } from "@/stores/userStore";
import { useCompanyStore } from "@/stores/companyStore";
import { usePatientStore } from "@/stores/patientStore";
import { sessionUser, userRole } from "@/data/session";
import { ref } from "vue";

export async function fetchInitialData() {
  const userStore = useUserStore();
  const companyStore = useCompanyStore();
  const patientStore = usePatientStore();

  const cookies = new URLSearchParams(document.cookie.split("; ").join("&"));
  const full_names = cookies.get("full_name");
  const image = cookies.get("user_image");
  const user_id = cookies.get("user_id");

  const f_name = ref("");
  const company = ref("");
  const appoints = ref([]);
  const patients = ref([]);
  // Fetch user details from Employee doctype
  const user = createListResource({
    doctype: "Employee",
    fields: ["salutation", "first_name", "last_name", "company"],
    filters: { user_id },
    auto: true,
    transform(data) {
      data.forEach((d) => {
        f_name.value = `${d.salutation} ${d.first_name} ${d.last_name}`;
        company.value = d.company;
      });
    },
  });

  companyStore.setCompany(company);
  userStore.setUser({
    name: f_name,
    role: await userRole.roles.fetch(),
    avatar: image,
  });

  // Fetch active patients
  const patientResource = createListResource({
    doctype: "Patient",
    fields: [
      "patient_name",
      "aged",
      "mobile",
      "sex",
      "gen_abbr",
      "name",
      "email",
      "blood_group",
      "first_name",
      "middle_name",
      "last_name",
      "pat_hist",
      "patient_details",
    ],
    filters: {
      status: "Active",
    },
    auto: true,
    pageLength: 200000,
    transform(data) {
      let count = 0;
      for (let d of data) {
        let label = d.patient_name;
        let description = d.patient_name + " | " + d.aged + " Yrs";
        let value = label + "," + d.mobile;
        let pt = {
          i: count,
          label: label,
          description: description,
          value: value,
          gender: d.sex,
          gen_abbr: d.gen_abbr,
          name: d.name,
          new: [
            d.first_name,
            d.middle_name,
            d.last_name,
            d.aged,
            d.sex,
            d.blood_group,
            d.mobile,
            d.email,
          ],
        };
        patientStore.setPatients(pt);
        // patients.value.push(pt);
        count++;
      }
    },
  });

  // fields: ['patient_name', 'aged', 'mobile', 'sex', 'gen_abbr', 'name', 'email', 'blood_group', 'first_name', 'middle_name', 'last_name', 'pat_hist', 'patient_details'],

  //patientStore.setPatients(patients)
}
