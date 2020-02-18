var employees = [];
var employeeIds = [];
var numOfEmployees = 0;


//Get the Browser
function getBrowser() {
    //Get the user agent string
    var user_string = navigator.userAgent;
    //Get the browser icon

    //Safari
    if (navigator.vendor == "Apple Computer, Inc.") {

        document.getElementById('browser').innerHTML = "Browser: Safari "  + "<img src=\"img/safari.jpg\" width=\"23%\" height=\"23%\">";



    }
    //Firefox
    else if (user_string.indexOf('Firefox') > -1) {

        document.getElementById('browser').innerHTML = "Browser: FireFox "  + "<img src=\"img/firefox.jpg\" width=\"23%\" height=\"23%\">";



    }
    //Edge
    else if (user_string.indexOf('Edge') > -1) {

        document.getElementById('browser').innerHTML = "Browser: Edge "  + "<img src=\"img/edge.jpg\" width=\"23%\" height=\"23%\">" ;

    }
    //Chrome
    else if (user_string.indexOf('Chrome') > -1) {

        document.getElementById('browser').innerHTML = "Browser: Chrome " + "<img src=\"img/chrome.jpg\" width=\"23%\" height=\"23%\">";
    }
        //anyother browser
    else if (user_string.indexOf('Undefined Browser') = 0) {
        document.getElementById('browser').innerHTML = "Undefined Browser" ;
    }



}

getBrowser();




function createEmployee() { //creates an empoloyee by getting name last name, department, todays date, and unique id.

    //get names
    var first_name = document.getElementsByName('first_name')[0].value; //jquery
    //the index 0 is used with jQuery objects to get "real" document element


    var last_name = document.getElementsByName('last_name')[0].value;
//the index 0 is used with jQuery objects to get "real" document element

    //get department
    var department = document.getElementById('department_select');
    var string_department = department.options[department.selectedIndex].text; //converts to string




    //get date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');     //got date with the help of mdn
    var yyyy = today.getFullYear();
   var today = mm + '/' + dd + '/' + yyyy;

    //generate id

    function generate_id() { //generates a unique id
        var id = (Math.floor(Math.random() * 100000000) + 1);    //eith the help of mdn
        return id;
    }
    //checks for dupe ids
    var employeeId = generate_id();
    while (employeeIds.indexOf(employeeId) > -1) {

        employeeId = generate_id();
    }
    numOfEmployees += 1;




    //creates  theemployee
    employee = {
        "first_name": first_name,
        "last_name": last_name,
        "department":string_department,
        "employee_id": employeeId,
        "hire_date": today,
        "total_employees": numOfEmployees
    };

    //push employee to employees array
    employees.push(employee);
    //push employee id to employeeIds array
    employeeIds.push(employeeId);

    console.log(employee); //checks to see if employee was sent to backend


    //print the epmplyees onto screen

    document.getElementById('employeeAdded').innerHTML = "Employee Added:";
    document.getElementById('name').innerHTML = "Name: " + first_name + " " + last_name;
    document.getElementById('department').innerHTML = "Department: " + string_department;
    document.getElementById('employee_id').innerHTML = "ID: " + employeeId.toString();
    document.getElementById('hire_date').innerHTML = "Hire Date: " + today;
    document.getElementById('total_employees').innerHTML = "Total Employees: " + employees.length.toString();//count array





//test

    $.ajax({
        url: "sendphp.php",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(employee),
        success: function (response) {
            console.log('Sent:Success');
        },
        error: function (response) {
            console.log("Sent:Failure");
            
        }
    });

}



