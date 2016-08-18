const Title = React.createClass({
  getInitialState:function(){
    this.btnClicked();
    this.getTotal();
    return {
      name:'',
      amount:'',
      credit:0,
      debit:0,
      data:[],
      totalcredit:0,
      totaldebit:0,
      totaloverall:0,
     
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



  deleteMe :function(id){
            console.log("DeleteMe");

   var url = `/transactions/${id}`
    fetch(url,
    {
      method: "DELETE",
      
    })
      .then(()=>{
      this.btnClicked();
      this.getTotal();
    })
 
    .catch(err => console.log('err',err))


  },
  modifyMe: function(id){
    var url = `/transactions/${id}`
    fetch(url,
    {
      method: "PUT",
      headers:{  "Content-type": "application/json"  },
      body:JSON.stringify(this.state)
      
    }).then(res=> {
      console.log(res);
    })



  },

  submitMe:function(event){
  event.preventDefault();
  var url ="/transactions"
   fetch(url,
     {
       method:"POST",
      headers:{  "Content-type": "application/json"  },
      body:JSON.stringify(this.state)
    }).then(res=>{
      this.btnClicked();
      this.getTotal();
      this.setState({credit:0,debit:0})
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
            <select id="selectid" onChange={this.onChangeMenu} name="transaction type">
              <option value="Choose">Choose</option>
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </div>
                
            <button  className = "btn btn-primary" id="btnid" type="submit" >Submit</button>
          </div>
        </div>
        </form>
      
        <DataDisplay data = {this.state.data} delete={this.deleteMe} update={this.modifyMe}/>
        <button className = "btn btn-primary" onClick ={this.getTotal} >GET TOTAL</button>
        <h3>Balance: {this.state.totaloverall}</h3>
        <h3>Total Credit: {this.state.totalcredit}</h3>
        <h3>Total Debit: {this.state.totaldebit}</h3>
      </div>
    )
  }
})

const DataDisplay = React.createClass({
 getInitialState:function(){
  return {
    editingId:'',
     taskInput:''
  }
 },


  deleteMe :function(id){
   this.props.delete(id);


  },
 
 modifyMe :function(info){
   console.log("modify me");
   this.setState({editingId: info._id, taskInput: info.name });
   console.log('editingId',this.state.editingId);


  },

  saveMe:function(id){
    let newObj = {}
    newObj.name = this.state.taskInput
    var url = `/transactions/${id}`
    fetch(url,
    {
      method: "PUT",
      headers:{  "Content-type": "application/json"  },
      body:JSON.stringify(newObj)
      
    }).then(res=> {
      console.log(res);
    })

  },
  onInputChange:function(event){
   console.log('event.target', event.target.value);
   this.setState({ taskInput : event.target.value});
  },
  render(){
       console.log('state',this.props.data)
       let person = this.props.data.map(info=>{
        const editing = info._id === this.state.editingId;
        const editingId = this.state.editingId
        const input = (
          <input type="text" value={this.state.taskInput} onChange = {this.onInputChange}/>
        )
        const editBtn = (<button 
                className ="btn btn-warning" 
                onClick={() => this.modifyMe(info)}
                onChange={info.name}
              >
                Modify

              </button>)
        const saveBtn = (
          <button className ="btn btn-warning" 
                onClick={() => this.saveMe(info._id)}>
                Save
              </button>)
        return(
          <tr key ={info._id}>
            <td>{info._id }</td>
            <td>{editing ? input : info.name }</td>
            <td>{info.credit}</td>
            <td>{info.debit}</td>
            <td>{info.amount}</td>
            <td>{info.time}</td>
            <td>
              <button 
                id={info._id} 
                className ="btn btn-danger" 
                onClick ={() => this.deleteMe(info._id)}
              >
                Delete
              </button>
              {editingId ? saveBtn : editBtn}
            </td>
          </tr>
          );
      });
      return (
       <table className="table table-bordered">
          <thead>
              <tr>
                 <th id= "tabheader"colSpan = "7">Transaction Details</th>
              </tr>

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



ReactDOM.render(<Title/>,document.getElementById('root'));