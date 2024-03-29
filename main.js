Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true 
    }
  },
  template: `
  <div class="product">
    <div class="product-image">
      <img v-bind:src="image">
    </div>
    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inStock">In stock</p>
      <p v-else>Out stock</p>
      <p>Shipping: {{ shipping }}</p>
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>
      <div v-for="(variant, index) in variants" 
        :key="variant.variantID"
        class="color-box"
        :style="{ backgroundColor: variant.variantColor}"
        @mouseover="updateProduct(index)">
      </div>
      <button v-on:click="addToCart" 
              :disabled="!inStock"
              :class="{ disabledButton: !inStock}">Add to Cart</button>
    </div>
    <div>
      <h2>Reviews</h2>
      <p v-if="!reviews.length">There are no reviews yet</p>
      <ul>
        <li v-for="review in reviews ">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>Review: {{ review.review }}</p>
        </li>
      </ul>
    </div>
    <product-review @review-submitted="addReview"></product-review>
  </div>`,

  data() {
    return {
      brand: 'Vue Mastery',
      product: 'socks',
      selectVariant: 0,
      details: ["80% Cotton", "20% Collester", "Gender-neutral"],
      variants: [
        {
          variantID: 2234,
          variantColor: "green",
          variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
          variantQality: 10
        },
        {
          variantID: 2235,
          variantColor: "blue",
          variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg",
          variantQality: 0
        }
      ],
      reviews: []
    }
  },
  methods: {
    addToCart: function(){
      this.$emit('add-to-cart', this.variants[this.selectVariant].variantID)
    },
    updateProduct: function(index) {
      this.selectVariant = index
    },
    addReview(productReview) {
     this.reviews.push(productReview) 
    }
  },
  computed:{
    title() {
      return this.brand + ' '+ this.product
    },
    image() {
      return this.variants[this.selectVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectVariant].variantQality
    },
    shipping() {
      if( this.premium){
        return 'Free'
      } else return 2.99
    }
  }
  
})

Vue.component('product-review', {
  template: ` 
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s)</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <p>
        <label for="name">Name: </label>
        <input id="name" v-model= "name">
      </p>
      <p>
        <label for="review">Review: </label>
        <textarea id="review" v-model= "review"></textarea>
      </p>
      <p>
        <label for="rating">Rating: </label>
        <select id="rating" v-model="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p>
        <input type="submit" value= "Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        this.errors = []
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        }
        this.$emit('review-submitted', productReview)
        this.name = null;
        this.review = null;
        this.rating = null
      } else {
        this.errors = []
        if(!this.name) this.errors.push("Name required.")
        if(!this.review) this.errors.push("Review required.")
        if(!this.rating) this.errors.push("Rating required.")
      }
    }
  }
})


var app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    }
  }
}) 
Vue.config.devtools = true;