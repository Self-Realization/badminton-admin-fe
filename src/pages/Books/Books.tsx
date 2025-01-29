import { useNavigate } from "react-router-dom";
import styles from "./Book.module.css";
import { IoChevronBack, IoAddOutline, IoSearchOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { IoCalendarClearOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FiFilter } from "react-icons/fi";
import { Offcanvas } from "react-bootstrap";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DateRangeFilter from "./components/DateRangeFilter";
import data from "./data.json";

interface HeaderProps {
  setSearch: Dispatch<SetStateAction<string>>;
  setDisplayData: Dispatch<SetStateAction<BookProps[]>>;
  bookData: BookProps[];
  category: string;
}

const categories = ["全部場次", "報名中", "進行中", "已結束"];

const Header = ({
  setSearch,
  setDisplayData,
  category,
  bookData,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const myFilter = () => {
    if (!startDate || !endDate || !bookData) return;
    // console.log("start date: ", startDate);
    // console.log("end date: ", endDate);
    // 處理日期變更
    setDisplayData(
      bookData.filter((item) => {
        if (!(category === categories[0] || category === item.state))
          return false;

        const dateObj = new Date(item.date); // 直接轉換為 Date 物件
        return dateObj >= startDate && dateObj <= endDate;
      }),
    );
    setShow(false);
  };

  const handleDateChange = (
    curStartDate: Date | null,
    curEndDate: Date | null,
  ) => {
    setStartDate(curStartDate);
    setEndDate(curEndDate);
    // console.log("開始日期:", startDate);
    // console.log("結束日期:", endDate);
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.nav}>
        <IoChevronBack
          color="white"
          size="22"
          fontWeight={900}
          onClick={() => navigate(-1)}
        />
        <p>場次管理</p>
      </div>
      <IoAddOutline
        color="white"
        size={24}
        fontWeight={900}
        style={{ position: "absolute", top: "10px", right: "10px" }}
      />

      <div className={styles.functions}>
        <IoSearchOutline
          size={22}
          fontWeight={900}
          color="white"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "10px",
            zIndex: "50",
          }}
        />
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="搜尋場次..."
        />
        <button onClick={() => setShow((prev) => !prev)}>
          <FiFilter color="white" size={22} />
        </button>
        <Offcanvas
          show={show}
          onHide={() => setShow(false)}
          placement="bottom"
          backdrop="static"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>塞選條件</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DateRangeFilter onDateChange={handleDateChange} />
            <button className={styles.btn} onClick={myFilter}>
              套用塞選
            </button>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

interface BookProps {
  book_id: string;
  place_name: string;
  team_name: string;
  date: string;
  time: string;
  state: string;
  total_of_member: number;
  amount_of_member: number;
}

const Book = ({
  book_id,
  place_name,
  team_name,
  date,
  time,
  state,
  amount_of_member,
  total_of_member,
}: BookProps) => {
  const color = ["rgba(0, 123, 255, 1)", "rgba(40, 167, 69, 1)", "gray"];
  const bgColor = [
    "rgba(184, 218, 255, 1)",
    "rgba(195, 230, 203, 1)",
    "lightgray",
  ];
  const [curState, setCurState] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (state == "報名中") {
      setCurState(0);
    } else if (state == "進行中") {
      setCurState(1);
    } else {
      setCurState(2);
    }
  }, [state]);

  const goDetail = () => {
    navigate(`/detail?book_id=${book_id}`);
  };

  return (
    <div className={styles.bookContainer} onClick={goDetail}>
      <h1>
        {place_name}（{book_id.substring(5)}）
      </h1>
      <h2>{team_name}</h2>
      <div className={styles.description}>
        <p>
          <IoCalendarClearOutline style={{ marginRight: "5px" }} />
          {date}
        </p>
        <p>
          <FaRegClock style={{ marginRight: "5px" }} />
          {time}
        </p>
        <p>
          <GoPeople style={{ marginRight: "5px" }} />
          {amount_of_member}/{total_of_member}
        </p>
      </div>

      <p
        className={styles.state}
        style={{
          color: `${color[curState]}`,
          backgroundColor: `${bgColor[curState]}`,
        }}
      >
        {state}
      </p>
    </div>
  );
};

interface CategoryProps {
  category: string;
  curCategory: string;
  setCategory: Dispatch<SetStateAction<string>>;
}

const Category = ({ curCategory, category, setCategory }: CategoryProps) => {
  return (
    <p
      onClick={() => setCategory(category)}
      style={{
        color: `${curCategory === category ? "rgba(0, 123, 255, 1)" : "gray"}`,
        backgroundColor: `${curCategory === category ? "rgba(184, 218, 255, 1)" : "lightgray"}`,
      }}
    >
      {category}
    </p>
  );
};

const Books = () => {
  const [bookData, setBookData] = useState<BookProps[]>([]);
  const [displayData, setDisplayData] = useState<BookProps[]>([]);
  const [search, setSearch] = useState<string>("");

  const [category, setCategory] = useState<string>(categories[0]);

  const getBooks = async () => {
    setBookData(data);
  };

  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    if (!bookData.length) return;
    if (category === categories[0]) {
      setDisplayData(bookData);
    } else {
      setDisplayData(bookData.filter((item) => item.state === category));
    }
  }, [category, bookData]);

  useEffect(() => {
    if (!search) {
      setDisplayData(
        bookData.filter(
          (item) => category === categories[0] || item.state === category,
        ),
      );
    } else {
      setDisplayData(
        bookData.filter(
          (item) =>
            (category === categories[0] || item.state == category) &&
            (item.place_name.includes(search) ||
              item.team_name.includes(search) ||
              item.book_id.includes(search)),
        ),
      );
    }
  }, [search, bookData]);

  return (
    <div className={styles.container}>
      <Header
        setSearch={setSearch}
        category={category}
        setDisplayData={setDisplayData}
        bookData={bookData}
      />
      <div className={styles.categoryContainer}>
        {categories.map((item, index) => (
          <Category
            category={item}
            curCategory={category}
            setCategory={setCategory}
            key={index}
          />
        ))}
      </div>
      <div className={styles.booksContainer}>
        {displayData.map((item, index) => (
          <Book
            key={index}
            book_id={item.book_id}
            place_name={item.place_name}
            team_name={item.team_name}
            date={item.date}
            time={item.time}
            state={item.state}
            amount_of_member={item.amount_of_member}
            total_of_member={item.total_of_member}
          />
        ))}
      </div>
    </div>
  );
};

export default Books;
