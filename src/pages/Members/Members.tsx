import styles from "./Members.module.css";
import HeaderSmall from "@/components/HeaderSmall/HeaderSmall";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import data from "./data.json";
import MemberCard from "./components/MemberCard/MemberCard";
import { MemberProps } from "@/utils/types";
import { apiPrefix, auth } from "@/utils/firebase";
import axios from "axios";

interface Props {
  title: string;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
}

const Category = ({ title, category, setCategory }: Props) => {
  return (
    <p
      onClick={() => setCategory(title)}
      style={{
        color: `${title === category ? `rgba(0, 123, 255, 1)` : "gray"}`,
        borderBottom: `${title === category ? "1.5px solid rgba(0, 123, 255, 1)" : "0px solid gray"}`,
      }}
    >
      {title}
    </p>
  );
};

const Members = () => {
  const categories = ["正常會員", "已封鎖"];
  const [category, setCategory] = useState<string>(categories[0]);
  const [memberData, setMemberData] = useState<MemberProps[]>([]);
  const [displayMember, setDisplayMember] = useState<MemberProps[]>([]);
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);

  useEffect(() => {
    console.log('====================================');
    console.log(memberData);
    console.log('====================================');
    if (category === categories[0]) {
      setDisplayMember(memberData.filter((item) => item.is_blocked === false));
    } else {
      setDisplayMember(memberData.filter((item) => item.is_blocked));
    }
  }, [category, memberData]);

  const getMembers = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(`${apiPrefix}/members/getMembers`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      setMemberData(data);
    } catch ( err ) {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
    }
  }


  useEffect(() => {
    getMembers();
  }, [updateStatus]);

  return (
    <>
      <HeaderSmall title="會員管理" />

      <div className={styles.container}>
        <div className={styles.categories}>
          {categories.map((item, index) => (
            <Category
              title={item}
              key={index}
              category={category}
              setCategory={setCategory}
            />
          ))}
        </div>
        <div className={styles.membersContainer}>
          {displayMember.map((item, index) => (
            <MemberCard
              user_id={item.user_id}
              profile_picture={item.profile_picture}
              user_name={item.user_name}
              amount_of_no_show={item.amount_of_no_show}
              amount_of_book={item.amount_of_book}
              is_blocked={item.is_blocked}
              add_time={item.add_time}
              setUpdateStatus={setUpdateStatus}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Members;
