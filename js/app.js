$(document).ready(()=> {
//FUNKCJE
//funkcja, która powoduje pojawienie się formularza do edycji
let addButtons = () => {
        const addButtons = $(".addButton");
        for (let i = 0; i < addButtons.length; i++){
            let button = addButtons[i];
            $(button).on("click", ()=>{
                if ($(button).text() === "+"){
                    $(button).text("-");
                    $(button).parent().next().fadeIn("slow");
                    $(button).parent().next().find("label").eq(1).show();
                    $(button).parent().next().find("#bookAuthor").show();
                    $(button).parent().next().find("#bookAdd").removeClass("searchButton").text("Add");
                    // $(button).parent().next().css("display", "block");
                } else {
                    $(button).text("+");
                    $(button).parent().next().fadeOut("2000");
                    $(button).parent().next().css("display", "none");
                }
            })
        }
};

$(".loupeIcon").on("click", (e)=>{
    let clickedLoupe = e.target;
    if ($(clickedLoupe).hasClass("search")){
        $(clickedLoupe).removeClass("search");
        $(clickedLoupe).parent().next().css("display", "none");
        $(clickedLoupe).parent().next().find("label").eq(1).show();
        $(clickedLoupe).parent().next().find("input").eq(1).show();
        $(clickedLoupe).parent().next().find("button").removeClass("searchButton").text("Add");

    } else {
        $(clickedLoupe).addClass("search");
        $(clickedLoupe).parent().next().find("label").eq(1).hide();
        $(clickedLoupe).parent().next().find("input").eq(1).hide();
        $(clickedLoupe).parent().next().find("button").addClass("searchButton").text("Search");
        $(clickedLoupe).parent().next().fadeIn("slow");

    }
})
//event na edycje
$('body').on("click", ".editButton", (e) => {
    let editedButton = e.target;
    if ($(editedButton).hasClass('edited')) {
        $(editedButton).removeClass('edited');
        $(editedButton).text('Edit');
        // $(editedButton).parent().find('p').eq(0).text()
        // $(editedButton).parent().find(".authorButton").attr('contenteditable', false);
        // $(editedButton).parent().find(".authorButton").attr('contenteditable', false);
        let title = $(editedButton).parent().find(".titleButton").val()
        let author = $(editedButton).parent().find(".authorButton").val()
        let selectedId = $(editedButton).parent().data("id");

        if ($(editedButton).parent().parent().hasClass("movie-list")){
            let updatedMovie = {
                title: title,
                author: author,
                done: false,
                recomended: true
            };

            updateData(urlMovie, selectedId, updatedMovie);

        } else if ($(editedButton).parent().parent().hasClass("movie-list-finished")) {
            let updatedMovie = {
                title: title,
                author: author,
                done: true,
                recomended: true
            };
            updateData(urlMovie, selectedId, updatedMovie);

        }
        $(editedButton).parent().find(".authorButton").remove();
        $(editedButton).parent().find(".titleButton").remove();
        $(editedButton).parent().find('p').eq(0).text(title).show();
        $(editedButton).parent().find('p').eq(1).text(author).show();
        if ($(editedButton).parent().parent().hasClass("book-list")) {
            let updatedBook = {
                title: title,
                author: author,
                done: false,
                recomended: true
            };
            updateData(urlBook, selectedId, updatedBook);
        } else if ($(editedButton).parent().parent().hasClass("books-list-finished")){
            let updatedBook = {
                title: title,
                author: author,
                done: true,
                recomended: true
            };
            updateData(urlBook, selectedId, updatedBook);
        }
        if ($(editedButton).parent().parent().hasClass("album-list")) {
            let updatedAlbum = {
                title: title,
                author: author,
                done: false,
                recomended: true
            };
            updateData(urlAlbum, selectedId, updatedAlbum);
        } else if ($(editedButton).parent().parent().hasClass("album-list-finished")){
            let updatedAlbum = {
                title: title,
                author: author,
                done: true,
                recomended: true
            };
            updateData(urlAlbum, selectedId, updatedAlbum);
        }
    } else {
        $(editedButton).addClass("edited");
        $(editedButton).text('Save');
        let title = $(editedButton).parent().find('p').eq(0).text();
        let author = $(editedButton).parent().find('p').eq(1).text();
        const newItems = $(`
                <input class="titleButton"></input>
                <input class="authorButton"></input>   
           `)
        $(editedButton).parent().prepend(newItems);
        $(editedButton).parent().find(".titleButton").val(title);
        $(editedButton).parent().find(".authorButton").val(author);
        // $(editedButton).parent().find(".titleButton").attr('contenteditable', true);
        // $(editedButton).parent().find(".authorButton").attr('contenteditable', true);
        $(editedButton).parent().find('p').eq(0).hide();
        $(editedButton).parent().find('p').eq(1).hide();
    }
})


//event do usuwania elementów listy
$("body").on("click", ".cancelButton", (e) => {
    let deleteButton = e.target;
    let selectedId = $(deleteButton).parent().data("id");
    if (($(deleteButton).parent().parent().hasClass("movie-list"))||($(deleteButton).parent().parent().hasClass("movie-list-finished"))){
        deleteData(urlMovie, selectedId);
    } else if (($(deleteButton).parent().parent().hasClass("book-list"))||($(deleteButton).parent().parent().hasClass("books-list-finished"))){
        deleteData(urlBook, selectedId);
    } else if (($(deleteButton).parent().parent().hasClass("album-list"))||($(deleteButton).parent().parent().hasClass("album-list-finished"))) {
        deleteData(urlAlbum, selectedId)
    }
    $(deleteButton).parent().remove();
})
let cancelListItem = (list) => {
        $(list).on("click", ".cancelButton", (e) =>{
            $(e.target).parent().remove()
        })
};
//funkcja do tworzenia nowych elementów listy
let newItemList = (data, list, listCompleted) => {
    list.html("");
    listCompleted.html("");
    data.map((elem) => {
            if(elem.done === "false"){
                const newItems = $(`
              <li class="box-little drag" data-id="${elem.id}">
                  <p class="titleParagraph">${elem.title} </p>
                  <p class="authorParagraph"> ${elem.author} </p>
                  <button class="editButton"> Edit </button>
                  <button class="cancelButton">Cancel</button>
                  <button class="completeButton">Completed</button>
              </li>
           `)
                $(list).prepend(newItems);
            } else if(elem.done === "true"){
                const newItems = $(`
              <li class="box-little" data-id="${elem.id}">
                  <p class="titleParagraph">${elem.title} </p>
                  <p class="authorParagraph"> ${elem.author} </p>
                  <button class="editButton"> Edit </button>
                  <button class="cancelButton">Cancel</button>
                  <button class="completeButton">Completed</button>
              </li>
           `)
                $(listCompleted).append(newItems);
                $(albumCompleteList).find("li").find(".completeButton").hide()
                $(bookCompleteList).find("li").find(".completeButton").hide()
                $(movieCompleteList).find("li").find(".completeButton").hide()
            }
    })

}
addButtons();
const urlApi = "http://localhost:3000";
const urlMovie = urlApi + "/movie";
const urlBook = urlApi + "/book";
const urlAlbum = urlApi + "/album"
const bookAddButton = $("#bookAdd");
const bookCompleteList = $(".books-list-finished");
const movieCompleteList = $(".movie-list-finished");
const albumCompleteList = $(".album-list-finished");
const bookComplete = $(".box2-container-left");
const movieComplete = $(".box2-container-middle");
const albumComplete = $(".box2-container-right");

//dodawanie nowej książki
$(bookAddButton).on("click",(e)=> {
    e.preventDefault()
    const parentList = $(".box-container-left");
    if (($(parentList).children().eq(1).children().eq(1).val() === "") || ($(parentList).children().eq(1).children().eq(3).val() === "")) {
        return null
        //tu będzie tooltip
    } else {
        // newItemList(parentList);
        let newBook = {
            title: $(parentList).children().eq(1).children().eq(1).val(),
            author: $(parentList).children().eq(1).children().eq(3).val(),
            done: false,
            recomended: true
        }
        sendData(urlBook, newBook)
        loadData(urlBook, "books")
        $(parentList).children().eq(1).children().eq(1).val("");
        $(parentList).children().eq(1).children().eq(3).val("");
    }

});
//dodawanie nowego filmu
const movieAddButton = $("#movieAdd");
$(movieAddButton).on("click",(e)=>{
    e.preventDefault()
    const parentList = $(".box-container-middle");
    if (($(parentList).children().eq(1).children().eq(1).val() === "") || ($(parentList).children().eq(1).children().eq(3).val() === "")) {
        return null
        //tu będzie tooltip
    } else {
        let newMovie = {
            title: $(parentList).children().eq(1).children().eq(1).val(),
            author: $(parentList).children().eq(1).children().eq(3).val(),
            done: false,
            recomended: true
        }
        sendData(urlMovie, newMovie)
        loadData(urlMovie, "movies")
        $(parentList).children().eq(1).children().eq(1).val("");
        $(parentList).children().eq(1).children().eq(3).val("");
    }
});
//dodawanie nowego albumu
const albumAddButton = $("#albumAdd");
$(albumAddButton).on("click",(e)=>{
    e.preventDefault()
    const parentList = $(".box-container-right");
    if (($(parentList).children().eq(1).children().eq(1).val() === "") || ($(parentList).children().eq(1).children().eq(3).val() === "")) {
        return null
        //tu będzie tooltip
    } else {
        // newItemList(parentList);
        let newAlbum = {
            title: $(parentList).children().eq(1).children().eq(1).val(),
            author: $(parentList).children().eq(1).children().eq(3).val(),
            done: false,
            recomended: true
        }
        sendData(urlAlbum, newAlbum)
        loadData(urlAlbum, "albums")
        $(parentList).children().eq(1).children().eq(1).val("");
        $(parentList).children().eq(1).children().eq(3).val("");
    }

});

/// Funckja do renderowania danych z JSONa
let renderData = (data, item)=> {
    if (item === "books" ){
        const listOfItems = $(".book-list");
        const listOfItemsCompleted = $(".books-list-finished")
        newItemList(data, listOfItems, listOfItemsCompleted);
    } else if (item === "movies"){
        const listOfItems = $(".movie-list")
        const listOfItemsCompleted = $(".movie-list-finished");
        newItemList(data, listOfItems, listOfItemsCompleted)
    } else if(item === "albums"){
        const listOfItems = $(".album-list")
        const listOfItemsCompleted = $(".album-list-finished");
        newItemList(data, listOfItems, listOfItemsCompleted);
    }
};


//Funkcja do zaciągania danych

let loadData = (givenUrl, item) => {
    $.ajax({url: givenUrl}).done((resp) =>{
        renderData(resp, item)
    }).fail((err) => {
        console.log(err);
    })
};

//Funkcja do dodawania danych do pliku JSON

let sendData = (givenUrl,newData) => {
    $.ajax({
        url:givenUrl,
        method: "POST",
        dataType: "json",
        data: newData
    }).done((resp)=>{
        // console.log("DONE: ",resp);
    }).fail((err) =>{
        console.log("ERR: ",err);
    })
};
//Funcjka do zapisywania edytowanych danych
let updateData = (givenUrl,id,givenData) => {
    $.ajax({
        url: givenUrl + "/" + id,
        method: "PUT",
        dataType: "json",
        data: givenData
    }).done((resp)=>{
        // console.log("DONE:", resp)
    }).fail((err)=>{
        console.log(err)
    })
};

//funcja do kasowania datych
let deleteData = (givenUrl, id) => {
    $.ajax({
        url: givenUrl + "/" + id,
        method: "DELETE",
        dataType: "json"
    }).done((resp) =>{
        // console.log("Działa usuowanie:" + resp)
    }).fail((err) =>{
        console.log(err)
    })
};


//przycisk complete
$("body").on("click", ".completeButton", (e)=>{
        let completeButton = e.target;
        let selectedId = $(completeButton).parent().data("id");
    // console.log(selectedId)
        if ($(completeButton).parent().parent().hasClass("movie-list")){
            let updatedMovie = {
                title: $(completeButton).parent().find('p').eq(0).text(),
                author: $(completeButton).parent().find('p').eq(1).text(),
                done: true,
                recomended: true
            };
            updateData(urlMovie, selectedId, updatedMovie);
            const newItems = $(`
                <li class="box-little">
                    <p class="titleParagraph">${updatedMovie.title} </p>
                    <p class="authorParagraph"> ${updatedMovie.author} </p>
                    <button class="editButton"> Edit </button>
                    <button class="cancelButton">Cancel</button>
                    <button class="completeButton">Completed</button>
                </li>
                    `)
            $(movieCompleteList).prepend(newItems);
            $(movieCompleteList).find(".completeButton").hide()
            $(completeButton).parent().remove();
        }
        if ($(completeButton).parent().parent().hasClass("book-list")) {
            let updatedBook = {
                title: $(completeButton).parent().find('p').eq(0).text(),
                author: $(completeButton).parent().find('p').eq(1).text(),
                done: true,
                recomended: true
            };
            updateData(urlBook, selectedId, updatedBook);
            const newItems = $(`
                <li class="box-little">
                    <p class="titleParagraph">${updatedBook.title} </p>
                    <p class="authorParagraph"> ${updatedBook.author} </p>
                    <button class="editButton"> Edit </button>
                    <button class="cancelButton">Cancel</button>
                    <button class="completeButton">Completed</button>
                </li>
                    `)
            $(bookCompleteList).prepend(newItems);
            $(bookCompleteList).find(".completeButton").hide()
            $(completeButton).parent().remove();

        }
        if ($(completeButton).parent().parent().hasClass("album-list")) {
            let updatedAlbum = {
                title: $(completeButton).parent().find('p').eq(0).text(),
                author: $(completeButton).parent().find('p').eq(1).text(),
                done: true,
                recomended: true
            };
            updateData(urlAlbum, selectedId, updatedAlbum);
            const newItems = $(`
                <li class="box-little">
                    <p class="titleParagraph">${updatedAlbum.title} </p>
                    <p class="authorParagraph"> ${updatedAlbum.author} </p>
                    <button class="editButton"> Edit </button>
                    <button class="cancelButton">Cancel</button>
                    <button class="completeButton">Completed</button>
                </li>
                    `)
            $(albumCompleteList).prepend(newItems);
            $(albumCompleteList).find(".completeButton").hide()
            $(completeButton).parent().remove();
        }

    })


$(".movie-list").sortable({
        connectWith: ".movie-list-finished",
        cancel: ".foundItem",
        receive: (event,ui)=>{
            let selectedId = $(ui.item).data("id");
            // console.log(id);
            let updatedMovie = {
                title: $(ui.item).find('p').eq(0).text(),
                author: $(ui.item).find('p').eq(1).text(),
                done: false,
                recomended: true
            };
            $(ui.item).find(".completeButton").show()
            updateData(urlMovie, selectedId, updatedMovie);

        }
});

$(".movie-list-finished").sortable({
    connectWith: ".movie-list",
    receive: (event,ui)=>{
        let selectedId = $(ui.item).data("id");
        // console.log(id);
        let updatedMovie = {
            title: $(ui.item).find('p').eq(0).text(),
            author: $(ui.item).find('p').eq(1).text(),
            done: true,
            recomended: true
        };
        $(ui.item).find(".completeButton").hide();
        updateData(urlMovie, selectedId, updatedMovie);

    }
});

$(".book-list").sortable({
        connectWith: ".books-list-finished",
        // cancel: ".titleParagraph, .authorParagraph",
        receive: (event,ui)=>{
            let selectedId = $(ui.item).data("id");
            // console.log(id);
            let updatedBook = {
                title: $(ui.item).find('p').eq(0).text(),
                author: $(ui.item).find('p').eq(1).text(),
                done: false,
                recomended: true
            };
            $(ui.item).find(".completeButton").show()
            updateData(urlBook, selectedId, updatedBook);

        }
    });

$(".books-list-finished").sortable({
        connectWith: ".book-list",
        receive: (event,ui)=>{
            let selectedId = $(ui.item).data("id");
            // console.log(id);
            let updatedBook = {
                title: $(ui.item).find('p').eq(0).text(),
                author: $(ui.item).find('p').eq(1).text(),
                done: true,
                recomended: true
            };
            $(ui.item).find(".completeButton").hide();
            updateData(urlBook, selectedId, updatedBook);
            // let completed = "true";

        }
});
$(".album-list").sortable({
        connectWith: ".album-list-finished",
        // cancel: ".titleParagraph, .authorParagraph",
        receive: (event,ui)=>{
            let selectedId = $(ui.item).data("id");
            // console.log(id);
            let updatedAlbum = {
                title: $(ui.item).find('p').eq(0).text(),
                author: $(ui.item).find('p').eq(1).text(),
                done: false,
                recomended: true
            };
            $(ui.item).find(".completeButton").show()
            updateData(urlAlbum, selectedId, updatedAlbum);
            // let completed = "true"; $(ui.item).find(".completeButton").show()

        }
    });

$(".album-list-finished").sortable({
        connectWith: ".album-list",
        receive: (event,ui)=>{
            let selectedId = $(ui.item).data("id");
            // console.log(id);
            let updatedAlbum = {
                title: $(ui.item).find('p').eq(0).text(),
                author: $(ui.item).find('p').eq(1).text(),
                done: true,
                recomended: true
            };
            $(ui.item).find(".completeButton").hide();
            updateData(urlAlbum, selectedId, updatedAlbum);
            // let completed = "true";

        }
    });


// $(".box-header").draggable();

loadData(urlMovie, "movies");
loadData(urlAlbum, "albums");
loadData(urlBook, "books");

const urlSearchBook = "http://openlibrary.org/search.json?q=";

$("body").on("click", ".searchButton", (e)=>{
    e.preventDefault()
    let button = e.target;
    if($(button).parent().parent().find("ul").find("li").hasClass("foundItem")){
        // $(button).attr("title", "Please Add or Cancel Found Items First");
        // $(button).tooltip();
        $( "#dialogSearch" ).dialog({
            height: 150,
            // title: no
            dialogClass: "no-close",
            buttons: [
                {
                    text: "OK",
                    click: function() {
                        $( this ).dialog( "close" );
                    }
                }
            ],
            position: {
                my: "left top",
                at: "left bottom",
                of: button
            },
            show: {
                effect: "blind",
                duration: 250
            },
            hide: {
                effect: "explode",
                duration: 1000
            },
        });

    } else {
        if($(button).parent().hasClass("bookForm")){
            let array = ($(button).parent().find("#bookTitle").val()).split(" ");
            let textForUrl = array.join("+");
            let urlSearch = urlSearchBook + textForUrl;
            // console.log(urlSearch);
            loadFoundData(urlSearch, "book");
            $(button).parent().find("#bookTitle").val("")
        } else if ($(button).parent().hasClass("movieForm")) {
            let array = ($(button).parent().find("#movieTitle").val()).split(" ");
            let textForUrl = array.join("+");
            let urlSearch = ApiMovieSite + textForUrl + ApiMovieKey;
            // console.log(urlSearch);
            loadFoundData(urlSearch, "movie");
            $(button).parent().find("#movieTitle").val("")
        }
    }

})
//Funkcja do zaciągania wyszukiwanych danych
let loadFoundData = (givenUrl, list) => {
        $.ajax({url: givenUrl}).done((resp) =>{
            if(list === "book"){
                const parsedData = JSON.parse(resp);
                renderFoundData(parsedData, list);
            } else if(list === "movie"){
                renderFoundData(resp, list);
            }

        }).fail((err) => {
            // console.log(err);
            noResultFound()

        })
};
let renderFoundData = (data, list)=>{
    if(list === "book") {

        if (data.num_found === 0) {
            noResultFound(list)
        }
        let title = data.docs[0].title_suggest;
        let author = data.docs[0].author_name;
        const foundItems = $(`
              <li class="box-little foundItem">
                  <p class="titleParagraph">${title} </p>
                  <p class="authorParagraph"> ${author} </p>
                  <button class="addFoundItemButton"> Add </button>
                  <button class="cancelFoundItemButton">Cancel</button>
              </li>
           `)
        $(".book-list").prepend(foundItems);
    } else if(list === "movie"){
        if(data.Response === "False") {
            noResultFound(list)
        } else{
            let title = data.Title;
        let author = data.Director;
        const foundItems = $(`
              <li class="box-little foundItem">
                  <p class="titleParagraph">${title} </p>
                  <p class="authorParagraph"> ${author} </p>
                  <button class="addFoundItemButton"> Add </button>
                  <button class="cancelFoundItemButton">Cancel</button>
              </li>
           `)
        $(".movie-list").prepend(foundItems);
        }

    }
}

let noResultFound = (list)=>{
    const foundItems = $(`
              <li class="box-little noFoundItem">
                  <p class="noReusultFound">Oops! No Results Found </p>
              </li>
           `)
    if(list === "book"){
        $(".book-list").prepend(foundItems);
        setTimeout((e)=>{
            $(".noFoundItem").remove();
        },5000)
    }else if(list === "movie"){
        $(".movie-list").prepend(foundItems);
        setTimeout((e)=>{
            $(".noFoundItem").remove();
        },5000)
    }

}
$("body").on("click", ".cancelFoundItemButton", (e) => {
        let deleteButton = e.target;
        $(deleteButton).parent().remove();
    })
$("body").on("click", ".addFoundItemButton", (e)=> {
        e.preventDefault()
        let button = e.target;
        if($(button).parent().parent().hasClass("book-list")){
            let newBook = {
                title: $(button).parent().find(".titleParagraph").text(),
                author: $(button).parent().find(".authorParagraph").text(),
                done: false,
                recomended: true
            }
            sendData(urlBook, newBook)
            loadData(urlBook, "books")
        } else if($(button).parent().parent().hasClass("movie-list")){
            let newMovie = {
                title: $(button).parent().find(".titleParagraph").text(),
                author: $(button).parent().find(".authorParagraph").text(),
                done: false,
                recomended: true
            }
            sendData(urlMovie, newMovie)
            loadData(urlMovie, "movies")
        }

})
let ApiMovieSite = "http://www.omdbapi.com/?t=";
let ApiMovieKey = "&apikey=3cdc21c4";

//tooltip
$(".addButton").tooltip();
$(".loupeIcon").tooltip();



});
