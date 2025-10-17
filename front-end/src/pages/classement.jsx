import { useState } from 'react';
import { Avatar, List, Skeleton, Input } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import InfiniteScroll from 'react-infinite-scroll-component';
import "./classement.css";
import "../index.css";

const dataUsers = [
    { user: 'Alpha', score: 450, gamePlayed: 55 },
    { user: 'Beta', score: 820, gamePlayed: 120 },
    { user: 'Gamma', score: 125, gamePlayed: 15 },
    { user: 'Delta', score: 999, gamePlayed: 210 },
    { user: 'Epsilon', score: 38, gamePlayed: 5 },
    { user: 'Zeta', score: 670, gamePlayed: 90 },
    { user: 'Eta', score: 233, gamePlayed: 42 },
    { user: 'Theta', score: 711, gamePlayed: 150 },
    { user: 'Iota', score: 50, gamePlayed: 8 },
    { user: 'Kappa', score: 10, gamePlayed: 2 },
    { user: 'Lambda', score: 888, gamePlayed: 180 },
    { user: 'Mu', score: 333, gamePlayed: 60 },
    { user: 'Nu', score: 60, gamePlayed: 10 },
    { user: 'Xi', score: 944, gamePlayed: 200 },
    { user: 'Omicron', score: 177, gamePlayed: 30 },
    { user: 'Pi', score: 422, gamePlayed: 75 },
    { user: 'Rho', score: 599, gamePlayed: 110 },
    { user: 'Sigma', score: 788, gamePlayed: 165 },
    { user: 'Tau', score: 99, gamePlayed: 18 },
    { user: 'Upsilon', score: 1000, gamePlayed: 220 },
    { user: 'Phi', score: 288, gamePlayed: 50 },
    { user: 'Chi', score: 644, gamePlayed: 130 },
    { user: 'Psi', score: 555, gamePlayed: 95 },
    { user: 'Omega', score: 377, gamePlayed: 70 }
];

const sortedDesc = [...dataUsers].sort((a, b) => b.score - a.score);

function Classement(){
  
  const [search, setSearch] = useState('');
  
  const filteredData = sortedDesc.filter(user => user.user.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
        <h1 className='title-page'>🏆 Classement des joueurs 🏆</h1>

        <div className="search-container">
            <Input placeholder="Rechercher un joueur" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className='div-classement'>
          <div id="scrollable-div" className="scrollable-div">
            <InfiniteScroll
                dataLength={sortedDesc.length}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                scrollableTarget="scrollable-div"
            >
                <List
                dataSource={filteredData}
                renderItem={item => (
                    <List.Item key={item.user}>
                    <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={item.user}
                        description={`Nombre de parties jouées : ${item.gamePlayed}`}
                    />
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