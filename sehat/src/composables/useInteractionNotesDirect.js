import { toValue,ref } from 'vue';
import { createListResource,createResource } from 'frappe-ui';
import { useinteractionLibraryStore } from '@/stores/interactionLibraryStore.js'
const library = useinteractionLibraryStore();

//(library.temp_form_based_meds)
//({Diplay:step_2[i],Functional:step_2[i],Category:"Unknown",Item:"",
// Qualifier:[],Unused:[],Symbol:"",Original:step_2[i],start:0,end:0,tokenStart:0,tokenEnd:0})
export function direct_out() {
    const result= ref([]);
    const result_grouped =ref();
    const comments =ref("");
    const stop_submit=ref(false);
    function group_meds(meds_lib=[],sel_mode,med){
        for(let i=0;i<meds_lib.length;i++){
            if(meds_lib[i].d_form==sel_mode && meds_lib[i].m_brand==med){
                return meds_lib[i].f_string;
            }
        }
        // return (meds_lib.reduce((accumulator, currentItem) => {
        // const { d_form, m_brand, f_string } = currentItem;
        // if (!accumulator[d_form]) {
        //     accumulator[d_form] = new Map();
        // }
        // accumulator[d_form].set(m_brand, f_string);
        // return accumulator;
        // }, {}));
    }


    function normalizeinput(raw){
            let newString=raw;
            const free_text= raw.match(/"(.*?)"/);
            if(free_text){
                comments.value=free_text[1]
                newString = raw.replace('"'+comments.value+'"', '');
            }
            const step_1=newString.trim().replace(/\r\n?/g, "\n").replace(/\u2028|\u2029/g, "\n").replace(/[ \t]+/g," ").replace(/([@#%^$;,&*!])\1+/g,"$1").toLowerCase();
            const step_2=(step_1.split(/[;,\n]+/).map(part => part.trim()).filter(Boolean));
            //Now search for special characters and split them
            let step_3a=[];
            for (let i = 0; i < step_2.length; i++) {
                
                if(/[@#$^*!]/.test(step_2[i])){
                    let rem_c1=step_2[i].substring(1);
                let index=(rem_c1.search(/[@#$^*!]+/));
                    if(index>0){
                        step_3a= step_2[i].split(/(?=[@#$^*!])/g).map(x => x.trim());
                        step_2.splice(i,1)
                    }
                }
            }
            if(step_3a.length>0){
            for (let i = 0; i < step_3a.length; i++){
                step_2.push(step_3a[i]);
            }
        }
            for(let i = 0; i<step_2.length; i++){
                result.value.push({pos:[i],Display:step_2[i],Functional:step_2[i],Category:"Unknown",Item:"",
                    Qualifier:[],Unused:[],Symbol:"",Original:step_2[i],tokenStart:0,tokenEnd:0, new:true,negation:false})
            }
            return result.value;
        }
        function sp_charcters_input(raw_array){
            const phrase_map=[];
            const symbolMap= {
            "@": "Symptoms",
            "#": "Meds",
            "$": "labs",
            "^": "Diagnosis",
            "*": "surg",
            "!": "Allergy"
        }
        result.value=raw_array.map((text) =>{
            const rawText =text.Original;
            //Default No Symbol
            let category ="Unknown";
            let cleanedText = text.Original;
           // let cleanedSpan = rawSpan;
            let symbol;
            if(rawText && symbolMap[rawText[0]]){
                symbol =rawText[0];
                category =symbolMap[symbol];
            //Strip the Symbol and any following spaces
            const after = text.Original.slice(1);
            const leadingSpaces = after.match(/^\s*/)[0].length;
            cleanedText = after.slice(leadingSpaces);
            const shift =1+leadingSpaces; // 1 for the symbol + skipped spaces
            //cleanedSpan = [rawSpan[0]+shift,rawSpan[1]]
            //Guard: if nothing remains after stripping, treat as unknown empty
            if(!cleanedText){
                category= "Unknown"
           //     cleanedSpan= rawSpan
            }}
            text.Display=cleanedText;
            text.Functional=cleanedText;
            text.Category=category;
            text.Symbol=symbol;
            phrase_map.push({category,
                text: cleanedText,
                //span: cleanedSpan,
                ...(symbol ? {symbol} : {}),
                rawText,
                //rawSpan,
            })
            return text
        })
        return result.value;
        }
        function check_med_form(clean_phrase){
            const keysIterator = library.dosage_form.keys();
            const form_array = Array.from(keysIterator);
            //console.log(form_array);
            result.value=clean_phrase.map((text) =>{
            const rawText =text.Functional;
            //Default No Symbol or qualifiers
            let category =text.Category;
            let cleanedText = text.Functional;
            let med_form;
            let full_med_form;
            for(let i=0;i<form_array.length;i++){
                if(rawText.includes(form_array[i])){
                    med_form=form_array[i];
                    full_med_form=library.dosage_form.get(med_form)
                    cleanedText = rawText.replace(med_form, '').trim().replace(/[ \t]+/g," ");
                    category ="Meds"
                    break;
                }
            }
            //Guard: if nothing remains after stripping, treat as unknown empty
            if(!cleanedText){
                category= "Unknown"
                //cleanedText=rawText
           //     cleanedSpan= rawSpan
            }
            if(full_med_form){
                text.Display=full_med_form+" "+cleanedText;
                text.Qualifier.splice();
                text.Qualifier.push({medicine_form:full_med_form})
            }else{
                text.Display=cleanedText;
            }
            text.Functional=cleanedText;
            text.Category=category;
            
            return text
        })
        return result.value;
        }
        function groupby_category(final_array){
            return (final_array.reduce((acc, item)=>{
            if(!acc[item.Category]){
                acc[item.Category] =[]
            }
            acc[item.Category].push(item);
            return acc;
        },{}))

        }
        function tokenize(phrase){
            const tokens=[];
            const re = /[A-Za-z0-9%+./-]+/g;
            let m;
            while ((m = re.exec(phrase))!==null){
                tokens.push({text:m[0], start:m.index, end: m.index + m[0].length})
            }
            //split each input of doctor on non word characters, keeping letters/digits/percent signs etc, will change as needed may be add ()
            return tokens;
        }
        function greedyMatch(phrase,maxGram=10){
            const pos =phrase.pos;
            const tokens = tokenize(phrase.Functional);
            const covered = Array(tokens.length).fill(false);
            let i=0;
            while (i<tokens.length){
                let found = null;
                let category ="Unknown";
                let bestLen=0;
                let entries=[];
                //try the longest n-gram first
                for (let n = Math.min(maxGram,tokens.length-i);n>=1;n--){
                    const key =tokens.slice(i,i + n).map(t=>t.text.toLowerCase()).join(" ");
                    //console.log(i)
                    switch (phrase.Category) {
                        case "Symptoms":
                            entries = library.sym_map.get(key)
                            break;
                        case "Meds":
                            if(phrase.Qualifier.length && phrase.Qualifier[0].medicine_form){
                                let d_sel= phrase.Qualifier[0].medicine_form.trim().toLowerCase();
                                entries = group_meds(library.temp_form_based_meds,d_sel,key);
                            }else{
                            entries = library.meds_map.get(key)}
                            break;
                        case "labs":
                            entries = library.lab_map.get(key)
                            break;
                        case "Diagnosis":
                            entries = library.diag_map.get(key)
                            break;
                        case "surg":
                            entries = library.surg_map.get(key)
                            break;
                        case "Allergy":
                            entries = library.all_allergy.get(key)
                            break;
                        default:
                            entries = library.full_db.get(key)
                        }
                    if(entries && entries.length){
                        found = {key,entry: entries};
                        category = entries[0];
                        bestLen =n;
                        break;
                    }
                }
                if (found){
                    //({Diplay:step_2[i],Functional:step_2[i],Category:"Unknown",Item:"",
// Qualifier:[],Unused:[],Symbol:"",Original:step_2[i],start:0,end:0,tokenStart:0,tokenEnd:0})
                    const startTok = i, endTok = i+bestLen-1;
                    for (let k = startTok; k<=endTok; k++)covered[k] =true;
                    i = endTok +1;
                    const leftovers= tokens.filter((_,idx)=> !covered[idx]);
                    result.value[pos].Category=category
                    result.value[pos].Functional=found.entry[1]
                    result.value[pos].Item=found.entry
                    result.value[pos].tokenStart=startTok
                    result.value[pos].tokenEnd=endTok
                    result.value[pos].Display=tokens.slice(startTok,endTok +1).map(t =>t.text).join(" ")
                    result.value[pos].Unused=leftovers
                    result.value[pos].new=false
                    // this may be pulled out to a separate function to pull off fuzzy matching
                    if(leftovers.length || category=="Meds"){
                        switch (category) {
                            case "Symptoms":
                                sym_qualifier(pos,found,leftovers)
                                break;
                            case "Meds":
                                med_qualifier(pos,found,phrase,leftovers)
                                break;
                            case "labs":
                                diag_qualifier(pos,found,leftovers)
                                break;
                            case "Diagnosis":
                                diag_qualifier(pos,found,leftovers)
                                break;
                            case "surg":
                                surg_qualifier(pos,found,leftovers)
                                break;
                            case "Allergy":
                                result.value[pos].Display=result.value[pos].Functional;
                                diag_qualifier(pos,found,leftovers)
                                break;
                            default:
                                console.log("No Matches Found, go for fuzzy matching and then go for prompt new")
                            }
                        }

                }else{
                    i +=1;
                }
            }
        }
        function buildLeftovers(leftovers,maxGram=10){
            const grams =[];
            for (let i =0; i<leftovers.length;i++){
                for (let n =Math.min(maxGram,leftovers.length -i); n>=1; n--){
                    const g = leftovers.slice(i,i+n).map(t => t.text).join(" ");
                    grams.push(g);
                }
            }
            return grams;
        }
        function sym_qualifier(pos,found,leftovers){
            const negative_keywords= ["no","denies","without","not","denied","not",
                "absent","nil","not since","not observed","not obv", 
                "not available","negative","neg"]
            let negative= false;
           // console.log(pos);
           // console.log(found);
            const ngrams=buildLeftovers(leftovers)
            for (let i =0; i<ngrams.length;i++){
                if(negative_keywords.includes(ngrams[i])){
                    negative=true;
                    // Symptom is negated
                    // check if there are any remaining qualifiers and make the final string
                    if(/\s/.test(ngrams[i])){
                        //multi word negation - split it and remove all from leftover array
                        const x=ngrams[i].split(/\s/g).map(y => y.trim());
                        leftovers= leftovers.map(t => t.text)
                        for(let n=0;n<x.length;n++){
                            const index = leftovers.indexOf(x[n]);
                            if (index !== -1) {
                                leftovers.splice(index, 1); // items will be ['a', 'b', 'd']
                            }
                        }
                        
                    }else{
                        // just removing just one word from leftovers array
                        leftovers= leftovers.map(t => t.text)
                        const index = leftovers.indexOf(ngrams[i]);
                        if (index !== -1) {
                            leftovers.splice(index, 1); // items will be ['a', 'b', 'd']
                        }
                    }
                    let comment= "Negative, ";
                    let remaining_string=leftovers.join(" ");
                    let final_string= comment+remaining_string
                        result.value[pos].Qualifier.splice()
                        result.value[pos].Qualifier.push({comments:final_string})
                        result.value[pos].Display= result.value[pos].Display +" (Negative "+leftovers.join(" ")+")"
                        result.value[pos].Unused=[]
                        result.value[pos].negation=true
                //console.log(ngrams[i])
                break;
                }                  
            }
            if(!negative){
                    leftovers= leftovers.map(t => t.text)
                    result.value[pos].Qualifier.splice()
                    result.value[pos].Qualifier.push({comments:leftovers.join(" ")})
                    result.value[pos].Display= result.value[pos].Display +" ("+leftovers.join(" ")+")"
                    result.value[pos].Unused=[]
                    result.value[pos].negation=false
                }
            //console.log(negative_keywords.includes(leftovers))


        }
        function surg_qualifier(pos,found,leftovers){
            // for now, just putting all extras in the comments, date and past surgeries remain
            leftovers= leftovers.map(t => t.text)
            result.value[pos].Qualifier.splice()
            result.value[pos].Qualifier.push({comments:leftovers.join(" ")})
            result.value[pos].Display= result.value[pos].Display +" ("+leftovers.join(" ")+")"
            result.value[pos].Unused=[]
        
        }
        function diag_qualifier(pos,found,leftovers){
            // for now, just putting all extras in the comments, chronic conditions remain
            leftovers= leftovers.map(t => t.text)
            result.value[pos].Qualifier.push({comments:leftovers.join(" ")})
            result.value[pos].Display= result.value[pos].Display +" ("+leftovers.join(" ")+")"
            result.value[pos].Unused=[]
        
        }
        function med_qualifier(pos,found,phrase,leftovers){
            //first getting default qualifiers and assigning them to display
            let disp = result.value[pos].Display;
            let active_ing= found.entry[3]
            let duration=found.entry[4]
            let dosage=found.entry[5]
            let sp_inst=found.entry[6]
            let full_text=leftovers.map(t => t.text).join(" ");
            const ngrams=buildLeftovers(leftovers)
            for (let i =0; i<ngrams.length;i++){
                let check=ngrams[i].replace(/[s]/g,"");
                if(library.med_duration.get(check)){
                duration = library.med_duration.get(check)
                full_text=full_text.replace(ngrams[i],"").trim().replace(/[ \t]+/g," ")
            }
                
                if(library.med_dosage.get(ngrams[i])){
                    //console.log(check)
                dosage = library.med_dosage.get(ngrams[i])
                full_text=full_text.replace(ngrams[i],"").trim().replace(/[ \t]+/g," ")
            }
            } 
            result.value[pos].Display=found.entry[2] +" "+ disp+"("+(active_ing?active_ing+" ,":"")+dosage+" ,"+duration+" ,"+(sp_inst?full_text+"; "+sp_inst:full_text)+")";
            result.value[pos].Qualifier.splice();
            result.value[pos].Qualifier.push({medicine_form:found.entry[2], 
                            dosage: dosage, 
                            period: duration,
                            comments: (full_text)
                        });
        }

    const interation_direct = (input) => {
        result.value=[];
        comments.value="";
        result_grouped.value=[];
        stop_submit.value=false;
        //console.log(input.value);
        const phrases = normalizeinput(input);
        //console.log(phrases);
        const sp_phrases = sp_charcters_input (phrases);
        const med_phrases=check_med_form(sp_phrases);
        for (const p of med_phrases){
           greedyMatch(p)
        }
        // if greedy match returns unknown- FUZZY MATCHING AND PHONETIC MATCHING (not for medicine) -- V2 development cycle
        for (const i of result.value){
            if(i.Category=="Unknown" ||i.new ){
                i.Item=[i.Category,i.Functional]
                stop_submit.value=true
               // console.log(i.Item)
                // here we will start the fuzzy match in v2, fuzzy match will also introduce abbrv etc
            }
        }
        result_grouped.value=groupby_category(result.value)
    };
return { result, interation_direct,library,result_grouped,comments,stop_submit }
}
