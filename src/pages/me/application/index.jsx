import { useState } from "react";
import Head from "next/head";
import TabNavigation from "../../../components/layouts/TabNavigation";
import SearchBarWithDropdown from "../../../components/challenge/SearchBarWithDropdown";
import ChallengeTable from "../../../components/application/ChallengeTable";
import Pagination from "../../../components/application/Pagination";
import styles from "../../../styles/pages/application/MyApplicationPage.module.css";

export default function MyApplicationPage() {
  const [selectedOption, setSelectedOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const seedData = [
    {
      id: 1023,
      docType: "OFFICIAL",
      field: "NEXTJS",
      title: "Next.js - App Router: Routing Fundamentals",
      maxParticipants: 10,
      applicationDate: "2024-01-16T09:00:00",
      deadline: "2024-02-24T23:59:59",
      status: "WAITING",
    },
    {
      id: 1022,
      docType: "BLOG",
      field: "API",
      title: "Fetch API, 너는 에러를 제대로 핸들링 하고 있는가?(dailydev)",
      maxParticipants: 5,
      applicationDate: "2024-01-16T10:00:00",
      deadline: "2024-02-23T23:59:59",
      status: "WAITING",
    },
    {
      id: 1021,
      docType: "OFFICIAL",
      field: "API",
      title: "Fetch API, 너는 에러를 제대로 핸들링 하고 있는가?(dailydev)",
      maxParticipants: 10,
      applicationDate: "2024-01-15T12:00:00",
      deadline: "2024-02-22T23:59:59",
      status: "WAITING",
    },
    {
      id: 1020,
      docType: "BLOG",
      field: "Career",
      title: "개발자로서 자신만의 브랜드를 구축하는 방법(dailydev)",
      maxParticipants: 5,
      applicationDate: "2024-01-14T08:00:00",
      deadline: "2024-02-22T23:59:59",
      status: "REJECTED",
    },
    {
      id: 1019,
      docType: "OFFICIAL",
      field: "NEXTJS",
      title: "Next.js - App Router: Routing Fundamentals",
      maxParticipants: 10,
      applicationDate: "2024-01-13T14:00:00",
      deadline: "2024-02-22T23:59:59",
      status: "ACCEPTED",
    },
    {
      id: 1018,
      docType: "OFFICIAL",
      field: "API",
      title: "Fetch API, 너는 에러를 제대로 핸들링 하고 있는가?(dailydev)",
      maxParticipants: 5,
      applicationDate: "2024-01-12T10:00:00",
      deadline: "2024-02-22T23:59:59",
      status: "REJECTED",
    },
    {
      id: 1017,
      docType: "OFFICIAL",
      field: "API",
      title: "Fetch API, 너는 에러를 제대로 핸들링 하고 있는가?(dailydev)",
      maxParticipants: 10,
      applicationDate: "2024-01-11T15:00:00",
      deadline: "2024-02-22T23:59:59",
      status: "ACCEPTED",
    },
    {
      id: 1016,
      docType: "BLOG",
      field: "Career",
      title: "개발자로서 자신만의 브랜드를 구축하는 방법(dailydev)",
      maxParticipants: 5,
      applicationDate: "2024-01-10T09:00:00",
      deadline: "2024-02-22T23:59:59",
      status: "ACCEPTED",
    },
    {
      id: 1015,
      docType: "BLOG",
      field: "NEXTJS",
      title: "Next.js - App Router: Routing Fundamentals",
      maxParticipants: 10,
      applicationDate: "2024-01-09T08:00:00",
      deadline: "2024-02-22T23:59:59",
      status: "ACCEPTED",
    },
    {
      id: 1014,
      docType: "BLOG",
      field: "NEXTJS",
      title: "Next.js - App Router: Routing Fundamentals",
      maxParticipants: 10,
      applicationDate: "2024-01-08T09:00:00",
      deadline: "2024-02-22T23:59:59",
      status: "DELETED",
    },
    {
      id: 2022,
      docType: "OFFICIAL",
      field: "NEXTJS",
      title: "Next.js - App Router: Routing Fundamentals",
      maxParticipants: 10,
      applicationDate: "2024-01-16T09:00:00",
      deadline: "2024-02-24T23:59:59",
      status: "WAITING",
    },
  ];

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredData = seedData
    .filter((item) => {
      if (
        searchTerm &&
        !item.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (selectedOption === "") {
        return true;
      }
      if (selectedOption === "승인 대기") {
        return item.status === "WAITING";
      } else if (selectedOption === "신청 승인") {
        return item.status === "ACCEPTED";
      } else if (selectedOption === "신청 거절") {
        return item.status === "REJECTED";
      } else if (selectedOption === "챌린지 삭제") {
        return item.status === "DELETED";
      }
      return true;
    })
    .sort((a, b) => {
      if (selectedOption === "신청 시간 빠른순") {
        return new Date(a.applicationDate) - new Date(b.applicationDate);
      } else if (selectedOption === "신청 시간 느린순") {
        return new Date(b.applicationDate) - new Date(a.applicationDate);
      } else if (selectedOption === "마감 기한 빠른순") {
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (selectedOption === "마감 기한 느린순") {
        return new Date(b.deadline) - new Date(a.deadline);
      }
      return 0;
    });

  // 페이지 수 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 현재 페이지의 데이터만 추출
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Head>
        <title>신청한 챌린지</title>
        <meta
          name="description"
          content="사용자가 신청한 모든 챌린지를 확인하는 페이지입니다."
        />
      </Head>
      <div className={styles.pageContainer}>
        <div className={styles.tabNavigationWrapper}>
          <TabNavigation activeTab="applications" />
        </div>
        <div className={styles.applicationSearchDropdownContainer}>
          <SearchBarWithDropdown
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onOptionChange={handleOptionChange}
          />
        </div>
        <div className={styles.challengeTableWrapper}>
          {paginatedData.length > 0 ? (
            <ChallengeTable data={paginatedData} /> // 페이지네이션된 데이터만 전달
          ) : (
            <div className={styles.noChallengesMessage}>
              아직 챌린지가 없어요.
            </div>
          )}
        </div>
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages} // 계산된 totalPages 사용
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
