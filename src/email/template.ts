export function createEmail(db: JSON[]) {
    var html = "<!DOCTYPE html>" + 
    "<html>" + 
    "<head>" + 
    "<style>" + 
    "table, th, td {" + 
    "  border:1px solid black;" + 
    "}" + 
    "th, td {" + 
    "	padding: 8px;" + 
    "}" + 
    "th {" + 
    "	background-color: #1a5dc9;" + 
    "  	color: white;" + 
    "}" + 
    "</style>" + 
    "</head>" + 
    "<body>" + 

    "<div>" + 
    "	<div style='background-color: #1a5dc9; color: white; font-size: 24px; text-align: center'>PO Request</div>" + 
    "	<div style='font-size: 20px'><p>Subject: Test.</p></div>" + 
    "    <div style='font-size: 18px'><p>This PO Request is pending for approval.</p></div>" + 
    "    <div style='text-align: center'><table style='margin: auto'>"; 
    // var parsed_data = JSON.parse(db)
    // console.log(db)
    var table: string = "<tr>";
    var Keys = Object.keys(db[0]);
    var th: string;
    // var td: string;
    // console.log(Keys)
    Keys.forEach( key =>{
        th += "<th>";
        th += key + "</th>";
    })
    // console.log(th);
    table += th + "</tr>";
    
    db.forEach( json_data_set =>{
        table += "<tr>"
        Object.keys(json_data_set).forEach( key =>{
            table += "<td>"
            table += json_data_set[key] + "</td>";
        })
        table += "</tr>"
    })
    // db.forEach(DB => {
    //     DB.
    // });
    html += table + 
    // "    	<tr>" + 
    // "        	<th>Test</th>" + 
    // "            <th>Testing</th>" + 
    // "        </tr>" + 
    // "        <tr>" + 
    // "        	<td>1</td>" + 
    // "            <td>2</td>" + 
    // "        </tr>" + 
    "    </table></div>" + 
    "</div>" + 

    "</body>" + 
    "</html>";
    return html;
}