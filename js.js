
console.log("Cargado Correctamente")

var firebaseConfig = {
    apiKey: "AIzaSyAKeBg1lAtbhqtdwaYCAYM_tj-JiV9ounQ",
    authDomain: "etsp-baff7.firebaseapp.com",
    projectId: "etsp-baff7",
    storageBucket: "etsp-baff7.appspot.com",
    messagingSenderId: "432208831746",
    appId: "1:432208831746:web:ce9b87e26b325fe4674e1b"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

var d = new Date();
var n = d.getDate()
var y = d.getFullYear()
var p = d.getMonth() + 1;
var fecha = n + "-" + p + "-" + y;

var tabla = document.getElementById("tabla")

db.collection("peliculas").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        tabla.innerHTML += `
<tr>
<th scope="row">${doc.id}</th>
<th scope="row">${doc.data().Nombre}</th>
<th scope="row">${doc.data().Fecha}</th>
<th scope="row">${doc.data().Director}</th>
<th scope="row">${doc.data().Recaudacion}</th>
<th scope="row">${doc.data().Musica}</th>
<th scope="row"><button type="button" data-toggle="modal" data-target="#editarpelicula" onclick="editarpelicula('${doc.id}')" class="btn btn-outline-warning">Editar</button> <button type="button" onclick="eliminarpelicula('${doc.id}')" class="btn btn-outline-danger">Eliminar</button> </th>
</tr>
`
    });
});


function eliminarpelicula(id) {
    Swal.fire({
        title: 'Estas seguro que deseas eliminar el pelicula?',
        text: "No podras recuperar la informacion perdida!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            db.collection("peliculas").doc(id).delete().then(function() {
                db.collection("Tareas").where("pelicula", "==", id).onSnapshot(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        if (doc.exists) {
                            db.collection("Tareas").doc(doc.id).delete().then(function() {
                                console.log("Document successfully deleted!");
                            }).catch(function(error) {
                                console.error("Error removing document: ", error);
                            });
                        }
                    });
                });
                Swal.fire('Exito!', 'Se ha eliminado correctamente.', 'success')
                location.reload();
            }).catch(function(error) {
                console.error("Error al eliminar un documento: ", error);
            });
        }
    })
}

function guardarpelicula() {
    console.log("Entro a guncion guardarpelicula")
    var nombrepelicula = document.getElementById("nombrepeliculaid").value
    var fechapelicula = document.getElementById("fechadelpelicula").value
    var directorpelicula= document.getElementById("directorpeliculaid").value
    var recaudacionpelicula= document.getElementById("recaudacionpeliculaid").value
    var musicapelicula= document.getElementById("directorMusicalpeliculaid").value
    if (nombrepelicula == "" || nombrepelicula == null || fechapelicula == "" || fechapelicula == null || musicapelicula == "" || musicapelicula == null || recaudacionpelicula == "" || recaudacionpelicula == null || directorpelicula == "" || directorpelicula == null) {
        Swal.fire('Atencion!', 'No se puede tener los campos vacios', 'warning')
    } else {
        db.collection("peliculas").add({
            Nombre: nombrepelicula,
            Fecha: fechapelicula,
            Director: directorpelicula,
            Recaudacion:recaudacionpelicula,
            Musica:musicapelicula,
        }).then(function(docRef) {
            Swal.fire('Exito!', 'Se ha guardado correctamente.', 'success')
            location.reload();
        }).catch(function(error) {
            console.error("Error al guardar informacion: ", error);
        });
    }
}

function editarpelicula(id) {
    console.log("Entro a funcion editarpelicula")
    var docRef = db.collection("peliculas").doc(id);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            var id = document.getElementById("IDpeliculaidEditar");
            id.value = doc.id;

            var title = document.getElementById("nombrepeliculaidEditar");
            title.value = doc.data().Nombre;

            var title2 = document.getElementById("fechadelpeliculaEditar");
            title2.value = doc.data().Fecha;

             var director = document.getElementById("directorpeliculaidEditar");
            director.value = doc.data().Director;

            var monto = document.getElementById("recaudacionpeliculaidEditar");
            monto.value = doc.data().Recaudacion;

             var musica = document.getElementById("directorMusicalpeliculaidEditar");
            musica.value = doc.data().Musica;

            Swal.fire('Exito!', 'Informacion Cargada Con Exito!', 'success')
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function guardarCambiospelicula() {

    var id = document.getElementById("IDpeliculaidEditar").value;
    var nombre = document.getElementById("nombrepeliculaidEditar").value;
    var Fecha = document.getElementById("fechadelpeliculaEditar").value;
    var director= document.getElementById("directorpeliculaidEditar").value;
    var recaudacion= document.getElementById("recaudacionpeliculaidEditar").value;
    var musica= document.getElementById("directorMusicalpeliculaidEditar").value;

    if (id == "" || id == null || nombre == "" || nombre == null || Fecha == "" || Fecha == null || director == "" || director == null || recaudacion == "" || recaudacion == null || musica == "" || musica == null) {
        Swal.fire('Error!', 'No puedes dejar informacion vacia!', 'warning')
    } else {
        var peliculaActualizar = firebase.firestore().collection("peliculas").doc(id);
        return peliculaActualizar.update({
            Nombre: nombre,
            Fecha: Fecha,
            Director:director,
            Recaudacion:recaudacion,
            Musica:musica,
        }).then(function() {
            console.log("Document successfully updated!");
            alert("Registro editado con exito")
            location.reload();
        }).catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }
}


