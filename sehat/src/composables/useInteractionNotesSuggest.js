import { toValue, ref } from "vue";
import { createListResource, createResource } from "frappe-ui";
import { useinteractionLibraryStore } from "@/stores/interactionLibraryStore.js";
const library = useinteractionLibraryStore();

//(library.temp_form_based_meds)
//({Diplay:step_2[i],Functional:step_2[i],Category:"Unknown",Item:"",
// Qualifier:[],Unused:[],Symbol:"",Original:step_2[i],start:0,end:0,tokenStart:0,tokenEnd:0})
export function suggest() {
  const search_result = ref();
  let all_search = ref([]);
  // getting all search keys

  function normalizeinput(raw) {
    let newString = raw;
    const step_1 = newString
      .trim()
      .replace(/\r\n?/g, "\n")
      .replace(/\u2028|\u2029/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/([@#%^$;,&*!])\1+/g, "$1")
      .toLowerCase();
    const step_2 = step_1
      .split(/[;,\n]+/)
      .map((part) => part.trim())
      .filter(Boolean);
    //Now search for special characters and split them
    let step_3a = [];
    for (let i = 0; i < step_2.length; i++) {
      if (/[@#$^*!]/.test(step_2[i])) {
        let rem_c1 = step_2[i].substring(1);
        let index = rem_c1.search(/[@#$^*!]+/);
        if (index > 0) {
          step_3a = step_2[i].split(/(?=[@#$^*!])/g).map((x) => x.trim());
          step_2.splice(i, 1);
        }
      }
    }

    if (step_3a.length > 0) {
      for (let i = 0; i < step_3a.length; i++) {
        step_2.push(step_3a[i]);
      }
    }
    for (let i = 0; i < step_2.length; i++) {
      search_result.value.push({
        pos: [i],
        Display: step_2[i],
        Functional: step_2[i],
        Category: "Unknown",
        Item: "",
        Qualifier: [],
        Symbol: "",
        Original: step_2[i],
      });
    }
    return search_result.value;
  }
  function sp_charcters_input(raw_array) {
    const phrase_map = [];
    const symbolMap = {
      "@": "Symptoms",
      "#": "Meds",
      $: "labs",
      "^": "Diagnosis",
      "*": "surg",
      "!": "Allergy",
    };
    search_result.value = raw_array.map((text) => {
      const rawText = text.Original;
      //Default No Symbol
      let category = "Unknown";
      let cleanedText = text.Original;
      // let cleanedSpan = rawSpan;
      let symbol;
      if (rawText && symbolMap[rawText[0]]) {
        symbol = rawText[0];
        category = symbolMap[symbol];
        //Strip the Symbol and any following spaces
        const after = text.Original.slice(1);
        const leadingSpaces = after.match(/^\s*/)[0].length;
        cleanedText = after.slice(leadingSpaces);
        const shift = 1 + leadingSpaces; // 1 for the symbol + skipped spaces
        //cleanedSpan = [rawSpan[0]+shift,rawSpan[1]]
        //Guard: if nothing remains after stripping, treat as unknown empty
        if (!cleanedText) {
          category = "Unknown";
          //     cleanedSpan= rawSpan
        }
      }
      text.Display = cleanedText;
      text.Functional = cleanedText;
      text.Category = category;
      text.Symbol = symbol;
      phrase_map.push({
        category,
        text: cleanedText,
        //span: cleanedSpan,
        ...(symbol ? { symbol } : {}),
        rawText,
        //rawSpan,
      });
      return text;
    });
    return search_result.value;
  }
  function check_med_form(clean_phrase) {
    const keysIterator = library.dosage_form.keys();
    const form_array = Array.from(keysIterator);
    //console.log(form_array);
    search_result.value = clean_phrase.map((text) => {
      const rawText = text.Functional;
      //Default No Symbol or qualifiers
      let category = text.Category;
      let cleanedText = text.Functional;
      let med_form;
      let full_med_form;
      for (let i = 0; i < form_array.length; i++) {
        if (rawText.includes(form_array[i])) {
          med_form = form_array[i];
          full_med_form = library.dosage_form.get(med_form);
          cleanedText = rawText
            .replace(med_form, "")
            .trim()
            .replace(/[ \t]+/g, " ");
          category = "Meds";
          break;
        }
      }
      //Guard: if nothing remains after stripping, treat as unknown empty
      if (!cleanedText) {
        category = "Unknown";
        //cleanedText=rawText
        //     cleanedSpan= rawSpan
      }
      if (full_med_form) {
        text.Display = full_med_form + " " + cleanedText;
        text.Qualifier.splice();
        text.Qualifier.push({ medicine_form: full_med_form });
      } else {
        text.Display = cleanedText;
      }
      text.Functional = cleanedText;
      text.Category = category;

      return text;
    });
    return search_result.value;
  }
  function tokenize(phrase) {
    const tokens = [];
    const re = /[A-Za-z0-9%+./-]+/g;
    let m;
    while ((m = re.exec(phrase)) !== null) {
      tokens.push({
        text: m[0].replace(/[^a-zA-Z0-9]/g, ""),
        start: m.index,
        end: m.index + m[0].length,
      });
    }
    //split each input of doctor on non word characters, keeping letters/digits/percent signs etc, will change as needed may be add ()
    return tokens;
  }
  function build_search_array(category, keyss) {
    const sym_key = Array.from(library.sym_map.keys());
    const med_key = Array.from(library.meds_form_map.keys());
    const lab_key = Array.from(library.lab_map.keys());
    const diag_key = Array.from(library.diag_map.keys());
    const surg_key = Array.from(library.surg_map.keys());
    const allergy_key = Array.from(library.all_allergy.keys());
    const all_keys = [
      ...sym_key,
      ...med_key,
      ...lab_key,
      ...diag_key,
      ...surg_key,
      ...allergy_key,
    ];

    switch (category) {
      case "Symptoms":
        filter(sym_key, library.sym_map);
        break;
      case "Meds":
        filter(med_key, library.meds_form_map);
        break;
      case "labs":
        filter(lab_key, library.lab_map);
        break;
      case "Diagnosis":
        filter(diag_key, library.diag_map);
        break;
      case "surg":
        filter(surg_key, library.surg_map);
        break;
      case "Allergy":
        filter(allergy_key, library.all_allergy);
        break;
      default:
        //console.log(all_keys)
        if (all_keys.filter((word) => word.includes(keyss)).length > 0) {
          let x = all_keys.filter((word) => word.includes(keyss));
          for (let nt = 0; nt <= x.length; nt++) {
            if (x[nt]) {
              let a_sym = library.sym_map.get(x[nt]);
              if (a_sym) all_search.value.push(a_sym);
              let a_med = library.meds_form_map.get(x[nt]);
              if (a_med) all_search.value.push(a_med);
              let a_lab = library.lab_map.get(x[nt]);
              if (a_lab) all_search.value.push(a_lab);
              let a_diag = library.diag_map.get(x[nt]);
              if (a_diag) all_search.value.push(a_diag);
              let a_surg = library.surg_map.get(x[nt]);
              if (a_surg) all_search.value.push(a_surg);
              let a_aller = library.all_allergy.get(x[nt]);
              if (a_aller) all_search.value.push(a_aller);
            }
          }
        }
    }

    function filter(keys_dict, lib) {
      if (keys_dict.filter((word) => word.includes(keyss)).length > 0) {
        let x = keys_dict.filter((word) => word.includes(keyss));
        for (let nt = 0; nt <= x.length; nt++) {
          if (x[nt]) {
            let ddd = lib.get(x[nt]);
            all_search.value.push(ddd);
          }
        }
      }
    }
  }
  function greedyMatch(phrase, maxGram = 10) {
    const pos = phrase.pos;
    const tokens = tokenize(phrase.Functional);
    let i = 0;
    while (i < tokens.length) {
      //try the longest n-gram first
      for (let n = Math.min(maxGram, tokens.length - i); n >= 1; n--) {
        const key = tokens
          .slice(i, i + n)
          .map((t) => t.text.toLowerCase())
          .join("");
        build_search_array(phrase.Category, key);
        if (all_search.value.length > 10) {
          break;
        }
      }
      i += 1;
    }
  }

  const search_direct = (input) => {
    search_result.value = [];
    all_search.value = [];
    const phrases = normalizeinput(input);
    //console.log(phrases);
    const sp_phrases = sp_charcters_input(phrases);
    const med_phrases = check_med_form(sp_phrases);
    for (const p of sp_phrases) {
      greedyMatch(p);
    }
    // if greedy match returns unknown- FUZZY MATCHING AND PHONETIC MATCHING (not for medicine) -- V2 development cycle
  };
  return { search_result, search_direct, all_search };
}
