import React from 'react'

import {Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where, toDate } from 'firebase/firestore';
import { useEffect, useState } from 'react'

import { db } from '../database/firebase';

export default function ReadingBook() {
    // 파이어스토어에서 가져온 값
    const [books, setBooks] =useState();
    
    // 가져올 값들
    const [done, setDone] = useState(false);
    const [memo, setMemo] = useState("");
    const [startDate, setStartDate] = useState("");
    const [title, setTitle] = useState();
    const [writer, setWriter] = useState();
    const [endDate, setEndDate] = useState("");
    
    // 수정될 값
    const [updateMemo, setUpdateMemo] = useState("");
    const [updateDone, setUpdateDone] = useState(false);
    const [updateEndDate, setUpdateEndDate] = useState("");

    // 검색할 값
    const [searchTitle, setSearchTitle] = useState("");
    //const [searchWriter, setSearchWriter] = useState("");

    // 검색된 값
    const [searchBook, setSearchBook] = useState("");

    // 시작하자마자 값을 가져오게 한다.
    useEffect(()=>{
        getData();
    }, [])

    // 비동기함수로 작성하여 값을 가져온다.
    async function getData(){
        const querySnapshot = await getDocs(collection(db, "booklist"));

        // forEach에서 출력한 모든 값을 배열에 담는다.
        let dataArray = [];
        // forEachf를 통해 모든 문서값에 접근하여 원하는 값을 가져온다.
        querySnapshot.forEach((doc)=>{
            dataArray.push({
                id : doc.id,
                ...doc.data()
            });

        })
        // 값이 들어간 배열을 state에 넣어 활용
        setBooks(dataArray);
    }

    const addDocData = async () => {
        
        try{
            //서버에 연결해서 사용(비동기 함수)
            const docRef = await addDoc(collection(db, "booklist"), {
                done,
                memo,
                startDate : Timestamp.fromDate(new Date()),
                title,
                writer,
                endDate
            });
            console.log("Document wrtten with ID : ", docRef.converter.id);
        } catch (e) {
            console.error("Error adding document : ", e);
        }
        getData();
    }

    // id값을 가져와서 삭제
    const deleteData = async(id)=>{
        //doc(db,컬렉션이름,id)로 하나의 문서를 찾을 수 있다.
        await deleteDoc(doc(db, "booklist", id));
        getData();
    }


    const writeMemo =  async(id) => {
        const inputMemo = prompt('작성하세요', '작성란');
        if(inputMemo !== null) {
            await updateDoc(doc(db, "booklist", id), {
                done : true,
                memo : inputMemo,
                endDate : Timestamp.fromDate(new Date())
            });
        }
        getData();
    }

    const onSearch = async () => {
        // where를 하나를 이용한 단일 쿼리
        const q = query(collection(db, "booklist"),
        where("title", "==", searchTitle));
        // 작성한 쿼리 객체를 getDocs를 이용하여 가져온다.
        const querySnapshot = await getDocs(q);
        let dataArray = []
        querySnapshot.forEach((doc)=>{
            dataArray.push({
                id : doc.id,
                ...doc.data()
            })
        });
        setSearchBook(dataArray);
    }

  return (
    <div>
        <h2>readingbooks 컬렉션</h2>
        <h1>책 추가</h1>
        <label htmlFor="">책 이름</label>
        <input type="text" onChange={(e)=>{setTitle(e.target.value)}}/>
        <br />
        <label htmlFor="">작가 이름</label>
        <input type="text" onChange={(e)=>{setWriter(e.target.value)}}/>
        <br />
        <button onClick={addDocData}>추가</button>
        <hr />
        <input type="text" onChange={(e)=>{setSearchTitle(e.target.value)}} />
        <button onClick={onSearch}>읽은 책 검색하기</button>
        <hr />
        {
            // 검색결과 출력
            searchBook && searchBook.map((book)=>(
                <div>
                    <h3>{book.title}</h3>
                    <p>{book.memo ? book.memo : "메모없음"}</p>
                </div>
            ))
        }
        <hr />
        {
            books && books.map((book)=>(
                <div>
                    <h3>{book.startDate.toDate().getMonth()+1}/{book.startDate.toDate().getDate()}~
                    {book.endDate && book.endDate ? `${book.endDate.toDate().getMonth()+1}/${book.endDate.toDate().getDate()}` : "읽는 중 "} 
                    {book.title} </h3>
                    {book.done ? book.memo : <button onClick={()=>{writeMemo(book.id)}}>감상문 적기</button>}
                    <button onClick={()=>{deleteData(book.id)}}>X</button>
                </div>
            ))
        }
    </div>
  )
}
