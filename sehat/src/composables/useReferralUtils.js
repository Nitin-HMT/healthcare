import { ref } from 'vue';
import { createListResource,Autocomplete,Switch,createResource,FormControl, Badge,Dialog } from 'frappe-ui';


export function referral() {

// Referal Doctors
let referdr=ref([]);
let selrefdr=ref("");
let error_ref= ref("");
let refer_create= ref(false);
const refferal = createListResource({
  doctype: "Referring Doctor",
  fields: ["*"],
  auto: true,
  pageLength: 200,
  transform(data) {
    for (let d of data) {
      let label = d.doctor_name;
      let description = d.more_information;
      let name = d.name;
      let pt = { "label": label, "name":name, "value": name, "description": description};
      referdr.value.push(pt);
    }
  }
});

  const make_newRef = (Name, Speciality) => {
    const make_refer = createResource({
        url: 'healthcare.api.make_refer',
        makeParams(){
            return {
                name:Name,
                desc:Speciality
            }
        },
        onSuccess: (data_refer) => {
       let pt = { "label": data_refer.doctor_name, "name":data_refer.name, "value": data_refer.name, "description": data_refer.more_information};
       referdr.value.push(pt);
        selrefdr.value=pt;
       refer_create.value=false;
       // console.log("success in dr refer");
      },
      onError(error) {
        error_ref.value=error
        },  
    })

    make_refer.submit();
    
  };


return { referdr, make_newRef, selrefdr,refer_create,error_ref }
}
