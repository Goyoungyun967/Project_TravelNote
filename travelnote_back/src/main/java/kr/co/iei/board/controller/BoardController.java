package kr.co.iei.board.controller;

import org.apache.ibatis.type.Alias;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.board.model.service.BoardService;

@CrossOrigin("*")
@RestController
@RequestMapping("/board")
public class BoardController {
	@Autowired
	private BoardService boardService;
}
