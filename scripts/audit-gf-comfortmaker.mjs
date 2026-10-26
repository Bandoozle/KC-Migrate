import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";

const full = readFileSync("tmp-parity/comfortmaker.html", "utf8");
const $ = cheerio.load(full);

const form = $("#gform_9");
console.log("action", form.attr("action"));
const hiddens = {};
form.find('input[type="hidden"]').each((_, el) => {
  const name = $(el).attr("name");
  const val = $(el).attr("value") || "";
  if (name) hiddens[name] = val.slice(0, 80);
});
console.log("hiddens", hiddens);

// Birthday month options
console.log("\nbirthday day count", form.find('select[name="input_39[]"]').eq(0).find("option").length);
console.log("month options", form.find('select[name="input_39[]"]').eq(1).find("option").toArray().map(o=>$(o).text().trim()).slice(0,15));
console.log("year options sample", form.find('select[name="input_39[]"]').eq(2).find("option").toArray().map(o=>$(o).text().trim()).slice(0,5), "...", form.find('select[name="input_39[]"]').eq(2).find("option").toArray().map(o=>$(o).text().trim()).slice(-3));

// Terms checkbox value
console.log("terms", form.find('input[name="input_52.1"]').attr("value"));
console.log("terms label", form.find("#label_9_52_1").text().trim());

// Address labels
form.find("#field_9_54 .gform-field-label, #field_9_54 label").each((_, el) => {
  console.log("addr1", $(el).text().replace(/\s+/g," ").trim());
});

// Phone field at top - input without label Phone in gfield?
console.log("\nphone fields", form.find('input[type="tel"]').toArray().map(el => $(el).attr("name")));

// Success message?
console.log("confirmation", $(".gform_confirmation_message").text().slice(0,100));
console.log("has gform_ajax", /gform_ajax/i.test(full));
