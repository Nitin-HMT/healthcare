# Copyright (c) 2024, earthians Health Informatics Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class OPDMedication(Document):
	def before_validate(self):
		self.oc_code_name = f"{self.clinic_abbr}-{self.medicine_brand}"
