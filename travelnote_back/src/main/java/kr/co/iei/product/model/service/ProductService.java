package kr.co.iei.product.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.product.model.dao.ProductDao;
import kr.co.iei.product.model.dto.ProductDTO;
import kr.co.iei.product.model.dto.ProductFileDTO;
import kr.co.iei.product.model.dto.ReviewDTO;
import kr.co.iei.product.model.dto.WishDTO;
import kr.co.iei.util.PageInfo;
import kr.co.iei.util.PageUtil;

@Service
public class ProductService {
	@Autowired
	private ProductDao productDao;
	
	@Autowired
	private PageUtil pageUtil;

	public Map selectProductList(int reqPage) {
		// 게시물 조회 및 페이징에 필요한 데이터를 모두 취합
		int numPerPage = 4;						// 한 페이지당 출력할 상품 갯수
		int pageNaviSize = 7;						// 페이지네비 길이
		int totalCount = productDao.totalCount();	// 전체 상품 수
		// 페이징에 필요한 값들을 연산해서 객체로 리턴받음
		PageInfo pi = pageUtil.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = productDao.selectProductList(pi);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("pi", pi);
		return map;
	}

	@Transactional
	public int insertProduct(ProductDTO product, List<ProductFileDTO> productFileList) {
		int result = productDao.insertProduct(product);
		for(ProductFileDTO productFile : productFileList) {
			productFile.setProductNo(product.getProductNo());
			result += productDao.insertProductFile(productFile);
		}
		return result;
	}

	public ProductDTO selectOneProduct(int productNo) {
		ProductDTO product = productDao.selectOneProduct(productNo);
		List<ProductFileDTO> fileList = productDao.selectOneProductFileList(productNo);
		List<ReviewDTO> reviews = productDao.selectOneProductReviews(productNo);
		product.setFileList(fileList);
		product.setReviews(reviews);
		return product;
	}

	public ProductFileDTO getProductFile(int productFileNo) {
		ProductFileDTO productFile = productDao.getProductFile(productFileNo);
		return productFile;
	}

	@Transactional
	public List<ProductFileDTO> deleteProduct(int productNo) {
		List<ProductFileDTO> fileList = productDao.selectOneProductFileList(productNo);
		int result = productDao.deleteProduct(productNo);
		if(result > 0) {
			return fileList;
		}else {			
			return null;
		}
	}

	@Transactional
	public List<ProductFileDTO> updateProduct(ProductDTO product, List<ProductFileDTO> productFileList) {
		int result = productDao.updateProduct(product);
		if(result > 0) {
			// 삭제한 파일이 있으면 조회 후 삭제
			List<ProductFileDTO> delFileList = new ArrayList<ProductFileDTO>();
			if(product.getDelProductFileNo() != null) {
				delFileList = productDao.selectProductFile(product.getDelProductFileNo());
				result += productDao.deleteProductFile(product.getDelProductFileNo());
			}
			// 새 첨부파일이 있으면 새 첨부파일을 insert
			for(ProductFileDTO productFile : productFileList) {
				result += productDao.insertProductFile(productFile);
			}
			int updateTotal = product.getDelProductFileNo() == null
					? 1 + productFileList.size()
					: 1 + productFileList.size() + product.getDelProductFileNo().length;
			if(result == updateTotal) {
				return delFileList;
			}
		}
		return null;
	}

	// 상품 좋아요
	@Transactional
	public int insertWish(int productNo, String userEmail) {
        // 중복 찜 방지 로직 (이미 찜한 상품인지 확인)
        int existingWish = productDao.checkExistingWish(productNo, userEmail);
        if (existingWish > 0) {
            return 0; // 이미 찜한 경우 0을 리턴
        }

        // 새로운 찜 추가
        return productDao.insertWish(productNo, userEmail);
    }

	// 리뷰 등록
	@Transactional
	public int insertReview(ReviewDTO review) {
		int result = productDao.insertReview(review);
		return result;
	}
	
	// 리뷰 수정
	@Transactional
	public int updateReview(ReviewDTO review) {
		int result = productDao.updateReview(review);
		return result;
	}

	// 리뷰 삭제
	@Transactional
	public int deleteReview(ReviewDTO review) {
		int result = productDao.deleteReview(review);
		return result;
	}
}
