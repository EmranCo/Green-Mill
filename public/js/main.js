//  created by : ابراهيم المحمدي

//  Js Function To Delete Product
function deleteProduct() {
    let btn = document.getElementById('deleteBtn')
    let id = btn.getAttribute('data-id')

    axios.delete('/products/delete/' + id)
        .then((res) => {
            console.log(res.data)
            alert('product was deleted')
            window.location.href = '/products'
        })

    .catch((err) => {

        console.log(err)
    })

}


//upload avatar Function

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader()

        reader.onload = function(e) {
            let image = document.getElementById("imagePlaceholder")
            image.style.display = "block"
            image.src = e.target.result

        }

        reader.readAsDataURL(input.files[0])
    }
}