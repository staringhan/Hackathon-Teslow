import { useEffect, useState, useCallback } from 'react';
import { Avatar, List, Skeleton, Input } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import "./classement.css";

function Classement(){
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  const loadMoreData = useCallback(() => {
    if (loading) return;

    setLoading(true);
    fetch(`https://660d2bd96ddfa2943b33731c.mockapi.io/api/users/?page=${page}&limit=10`)
      .then(res => res.json())
      .then(res => {
        const results = Array.isArray(res) ? res : [];
        setData(prev => [...prev, ...results]);
        setLoading(false);
        setPage(prev => prev + 1);
      })
      .catch(() => setLoading(false));
  }, [loading, page]);
  
  useEffect(() => {
    loadMoreData();
  }, [loadMoreData])
  
  const filteredData = data.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
        <h1 className='title-classement'>🏆 Classement des joueurs 🏆</h1>

        <div className="search-container">
            <Input placeholder="Rechercher un joueur" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className='div-classement'>
          <div id="scrollable-div" className="scrollable-div">
            <InfiniteScroll
                dataLength={data.length}
                next={loadMoreData}
                hasMore={data.length < 50}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                scrollableTarget="scrollable-div"
            >
                <List
                dataSource={filteredData}
                renderItem={item => (
                    <List.Item key={item.email}>
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a href="https://ant.design">{item.name}</a>}
                        description={item.email}
                    />
                    <div>Content</div>
                    </List.Item>
                )}
                />
             </InfiniteScroll>
            </div>
        </div>
    </div>
  );
};

export default Classement;