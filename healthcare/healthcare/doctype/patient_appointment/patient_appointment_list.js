/*
(c) ESS 2015-16
*/
frappe.listview_settings["Patient Appointment"] = {
	filters: [["status", "=", "Open"]],
	get_indicator: function(doc) {
		var colors = {
			"Open": "blue",
			"Scheduled": "yellow",
			"Closed": "green",
			"Cancelled": "grey",
			"Expired": "grey",
			"Checked In": "purple",
			"Checked Out": "orange",
			"Confirmed": "purple",
			"No Show": "red"
		};
		return [__(doc.status), colors[doc.status], "status,=," + doc.status];
	}
};
