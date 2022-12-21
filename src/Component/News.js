import React, { Component } from "react";
import NewsItem from "../NewsItem";
import Spinner from "./Spinner";
import propTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
  }
  static propTypes = {
    country: propTypes.string,
    pageSize:propTypes.number,
    category: propTypes.string
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  constructor(props) {
    super(props); 
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    };
    document.title =`${this.capitalizeFirstLetter(this.props.category)} - Sauri | News`;
  }

async updateNews(pageNo)
  {
    this.props.setProgress(10);
  const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=416b7bc9fca84347b5869f766c813842&page=${this.state.page}&pageSize=${this.props.pageSize}`;
  this.setState({loading: true});
  let data = await fetch(url);
  this.props.setProgress(30);
  let parsedata = await data.json();
  this.props.setProgress(70);
  this.setState({
    articles: parsedata.articles, 
    totalResults:parsedata.totalResults,
    loading: false });
    this.props.setProgress(100);
  }
  
 

  async componentDidMount() 
    {
    this.updateNews();
    }

 fetchMoreData= async()=>
    {
     const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=416b7bc9fca84347b5869f766c813842&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
      this.setState({page: this.state.page + 1})
      let data = await fetch(url);
      let parsedata = await data.json();
      this.setState({
        articles:this.state.articles.concat(parsedata.articles),
        totalResults: parsedata.totalResults, });
    }

  render() {
     return (
      <div className="container my-3">
       <h1 className="text-center" style={{marginTop: '80px'}}>Sauri | News - Top {this.capitalizeFirstLetter(this.props.category)} Headlines </h1>
      { this.state.loading && <Spinner/>}
        <div className="row">
        <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner/>}
                > 
                 <div className="container">

                    <div className="row">
                        {this.state.articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                    </div> 
                </InfiniteScroll>
        </div>
      
      </div>
    );
  }
}

export default News;
