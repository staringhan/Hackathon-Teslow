import { useState, useEffect } from "react";
import { Avatar, List, Skeleton, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import "./classement.css";
import "../index.css";
import { fetchLeaderboard } from "../services/leaderboardService";

function Classement() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const leaderboard = await fetchLeaderboard();
      setData(leaderboard);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredData = data
    .filter((user) => user.userName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.gamesPlayed - a.gamesPlayed);

  return (
    <div>
      <h1 className="title-page">🏆 Classement des joueurs 🏆</h1>

      <div className="search-container">
        <Input
          placeholder="Rechercher un joueur"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="div-classement">
        <div id="scrollable-div" className="scrollable-div">
          <InfiniteScroll
            dataLength={filteredData.length}
            loader={loading && <Skeleton avatar paragraph={{ rows: 1 }} active />}
            scrollableTarget="scrollable-div"
          >
            <List
              dataSource={filteredData}
              renderItem={(item) => (
                <List.Item key={item.userId}>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.userName}
                    description={`Nombre de parties jouées : ${item.gamesPlayed}`}
                  />
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}

export default Classement;
