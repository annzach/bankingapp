const Title = React.createClass({
  getInitialState:function(){

    return {
      name:'',
      amount:'',
      credit:0,
      debit:0,
      data:[],
      totalcredit:0,
      totaldebit:0,
      totaloverall:0
    }

  },
  onChangeName:function(event){
       this.setState({name:event.target.value});
  },
  
  onChangeAmount:function(event){
      this.setState({amount:event.target.value});
  },
  onChangeMenu:function (event){
     
    if(event.target.value == 'Debit')
      {
      console.log("debit");
        this.setState({debit:this.state.amount});
        this.setState({credit:this.state.credit});
      }
      else if(event.target.value == 'Credit') {
        console.log('credit');
        this.setState({credit:this.state.amount});
        this.setState({debit:this.state.debit});
        console.log("good credit");
      }
      else{
        console.log("hurray");
      }
   

    
  },

  getTotal: function(event){
    console.log("getTotal clicked");

   var url = `/transactions/total`
    fetch(url,
    {
      method: "GET",
       headers : {
        "Content-type":"application/json"
      } 
      
    })
      .then(res => {
        console.log(res);
        return res.json();
    }).then(frontStore => {
      console.log(frontStore);
      this.setState({totalcredit:frontStore.totalcredit});
      this.setState({totaldebit:frontStore.totaldebit});
      this.setState({totaloverall:frontStore.diff});
    })
 
    .catch(err => console.log('err',err))


  },



  DeleteMe :function(id){
            console.log("DeleteMe");

   var url = `/transactions/${id}`
    fetch(url,
    {
      method: "DELETE",
      
    })
      .then(res => {
        console.log(res);
        return res.json();
    })
 
    .catch(err => console.log('err',err))


  },

  submitMe:function(event){
  event.preventDefault();
  var url ="/transactions"
   fetch(url,
     {
       method:"POST",
      headers:{  "Content-type": "application/json"  },
      body:JSON.stringify(this.state)
    })
    console.log("this.state:", this.state)

  },

  btnClicked: function(event){
    var url=`/transactions/`
    fetch(url,
    {
      method: "GET",
      headers : {
        "Content-type":"application/json"
      }   
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      
      this.setState({data:data});
    })
    .catch(err => console.log('err','err'))
  },
  render(){
    return (
      <div id ="Maindiv">
        <form onSubmit ={this.submitMe}>
        <input type="text" className="form-control" value ={this.state.name} placeholder="Transcation name" onChange={this.onChangeName}/>
          <div>
         <input type="text" className="form-control" value ={this.state.amount} placeholder="Amount" onChange={this.onChangeAmount}/>
          <div>
        
         <div>
            <select onChange={this.onChangeMenu} name="transaction type">
              <option value="Choose">Choose</option>
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </div>
       
              <button className = "btn btn-primary" id="btnid" type="submit" onClick ={this.btnClicked}>Submit</button>
          </div>
        </div>
        </form>
      
         <DataDisplay data = {this.state.data} delete={this.DeleteMe}/>
             <button onClick ={this.getTotal}>GET TOTAL</button>
              <h2>Balance: {this.state.totaloverall}</h2>
         <h2>Credit: {this.state.totalcredit}</h2>
         <h2>Debit: {this.state.totaldebit}</h2>
       </div>
    )
  }
})

const DataDisplay = React.createClass({



  DeleteMe :function(event){

   var id = event.target.id;
   this.props.delete(id);


  },
 
 ModifyMe :function(){
   console.log("modify me");
  },
  render(){
       console.log('state',this.props.data)
       let person = this.props.data.map(info=>{
        return(
          <tr key ={info._id}>
            <td>{info._id }</td>
            <td>{info.name }</td>
            <td>{info.credit}</td>
            <td>{info.debit}</td>
            <td>{info.amount}</td>
            <td>{info.time}</td>
            <td><button id={info._id} className ="btn btn-danger" onClick ={this.DeleteMe}>Delete</button><button className ="btn btn-warning" onClick={this.ModifyMe}>Modify</button></td>
          </tr>
          );
      });
      return (
       <table className="table table-bordered">
          <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Transaction Name</th>
                <th>Credit</th>
                <th>Debit</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Delete/Modify</th>
              </tr>
            </thead>
            <tbody>
              {person}
            </tbody>
        </table>
        )

    
  }


})



/*const totalData = React.createClass({

   DeleteMe :function(event){
   var id = event.target.id;
   this.props.delete(id);


  },
  render(){
    console.log('totalData route');
    console.log('state',this.props.data)
      let info = this.props.data;
        return(
          <tr key ={}>
            <td>{info.credit}</td>
            <td>{info.debit}</td>
            <td>{info.amount}</td>
            <td><button id={info._id} className ="btn btn-danger" 
            onClick ={this.DeleteMe}>Delete</button>
            <button className ="btn btn-warning" 
            onClick={this.ModifyMe}>Modify</button></td>
          </tr>
          );
      });
    return(
       <table className="table table-bordered">
          <thead>
              <tr>
                <th>Total Credit</th>
                <th>Total Debit</th>
                <th>Total Amount</th>
                </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      )
  }

})*/

ReactDOM.render(<Title/>,document.getElementById('root'));
