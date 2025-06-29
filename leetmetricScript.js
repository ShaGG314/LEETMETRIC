document.addEventListener('DOMContentLoaded',function(){
    const searchButton    = document.getElementById("user_input_button");
    const userInput       = document.getElementById("user_input_field");
    const stats_container  = document.querySelector(".stats_container");
    const easyCircle      = document.querySelector(".progress_item_easy");
    const mediumCircle    = document.querySelector(".progress_item_medium");
    const hardCircle      = document.querySelector(".progress_item_hard");
    const easyLabel       = document.querySelector(".progress_label_easy circle");
    const mediumLabel     = document.querySelector(".progress_label_medium circle");
    const hardLabel       = document.querySelector(".progress_label_hard circle");
    

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);

        label.textContent = '${solved}/${total}';
    }

    function displayUserData(parsedData){
        const totalQues       = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues   = parsedData.data.allQuestionsCount[1].count;
        const totalmediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues   = parsedData.data.allQuestionsCount[2].count;

        const solvedQuestions       = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedEasyQuestions   = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMediumQuestions = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHardQuestions   = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;
    
        updateProgress(solvedEasyQuestions, totalEasyQues, easyLabel, easyCircle);
        updateProgress(solvedMediumQuestions, totalmediumQues, mediumLabel, mediumCircle);
        updateProgress(solvedHardQuestions, totalHardQues, hardLabel, hardCircle);
    }
    
    function validateUsername(username){
        if(username.trim()===""){
            alert("username cannot be empty");
            return false;
        }
        const regularExpression = /^[a-zA-Z][a-zA-Z0-9]*(?:(?:[._-])(?!.*(?:[._-]{2}))[a-zA-Z0-9]+)*[a-zA-Z0-9]$/;
        const isMatching = regularExpression.test(username);
        if(!isMatching){
            alert("Inavlid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username){
        // const url =;
        try{
            searchButton.textContent = "Searching";
            searchButton.disabled = true;

            const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; 
            const targetUrl = 'https://leetcode.com/graphql/';
            
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyUrl+targetUrl, requestOptions);

            // const response = await fetch(url);
            if(!response.ok){
                throw new Error("unable to fetch the user details");
            }
            const parsedData = await response.json();
            console.log("logging data:",parsedData);

            displayUserData(parsedData);
        }
        catch(error){
            stats_container.innerHTML = '<p>No data found</p>';
        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
            stats_container.style.display = "flex";
        }
    }

    searchButton.addEventListener('click',function(){
        const username = userInput.value;
        console.log("Input name :",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})