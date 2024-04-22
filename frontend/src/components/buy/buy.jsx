import {React ,useState} from 'react'; 
import './Appbuy.css';
import Header from 	"../Main/Header"
import Sidebar from "../Main/Sidebar";



// const [openSidebarToggle, setOpenSidebarToggle] = useState("");

//     const OpenSidebar = () => {
//       setOpenSidebarToggle(!openSidebarToggle);
//     }



const OrderForm = () => {
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState('');
  const [product, setProduct] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  // Function to calculate subtotal
  const calculateSubtotal = () => {
    setSubtotal(quantity * unitPrice);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here
    console.log('Form submitted!');
  };

  return (

    <div className="order-form-container">
                  {/* <Header OpenSidebar={OpenSidebar}/>
                  <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/> */}
                <h1 className="form-title">Commande</h1>
              <form onSubmit={handleSubmit}>        

              <div className="form-group">
              <div className="customer-date-container">
                <div>
                  <label htmlFor="customer">Customer:</label>
                  <select id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)}>
                    <option value="">Select Customer</option>
                    <option value="Customer 1">Customer 1</option>
                    <option value="Customer 2">Customer 2</option>

                  </select>
                </div>
              <div>
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>



        <div className="form-group">
          <div className="others-container"> 
          <label htmlFor="product">Product:</label>
          <select id="product" value={product} onChange={(e) => setProduct(e.target.value)}>
            <option value="">Select Product</option>
            <option value="Product 1">Product 1</option>
            <option value="Product 2">Product 2</option>
            {/* Add more products as needed */}
          </select>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              calculateSubtotal();
            }}
          />
          <label htmlFor="unitPrice">Unit Price:</label>
          <input
            type="number"
            id="unitPrice"
            value={unitPrice}
            onChange={(e) => {
              setUnitPrice(e.target.value);
              calculateSubtotal();
            }}
          />
          <label htmlFor="subtotal">Subtotal:</label>
          <input type="text" id="subtotal" value={subtotal} readOnly />
        </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default OrderForm;
