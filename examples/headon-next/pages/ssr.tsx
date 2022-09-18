function Page(props:any) {
    // Render data...
    return (<div>
        hello 123 {props.data}
    </div>)
  }
  
  // This gets called on every request
  export async function getServerSideProps() {
    // Fetch data from external API
    
    const data = 'xxxxxxxx';
  
    // Pass data to the page via props
    return { props: { data } }
  }
  
  export default Page